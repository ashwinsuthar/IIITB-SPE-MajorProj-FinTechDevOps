#!/bin/bash

# Configuration
LOG_DIR="logs"
mkdir -p "$LOG_DIR"

# Memory limit for each service - very strict to save RAM
JAVA_MEM_OPTS="-Xms64m -Xmx256m"
export GRADLE_OPTS="-Xmx256m"

echo "========== Stock Portfolio System: Full Restart =========="

# 1. Cleanup Phase
echo "Step 1: Cleaning up existing processes..."

# Kill Java/Gradle processes for this user
pkill -u $(whoami) -f java || true
pkill -u $(whoami) -f gradlew || true

# Kill Python (Uvicorn) processes
pkill -u $(whoami) -f uvicorn || true

# Kill Node/React processes
pkill -u $(whoami) -f "npm run dev" || true
pkill -u $(whoami) -f vite || true

# Force stop any dangling gradle daemons
./gradlew --stop || true

echo "Cleanup complete."

# 2. Infrastructure (Docker)
echo "Step 2: Ensuring Docker Infrastructure is UP..."
# We use 'up -d' to ensure it's running. 'down' is optional but 'up' is enough if config hasn't changed.
docker compose up -d

# 3. Python Service
echo "Step 3: Starting Python Price Prediction Service..."
cd price-prediction
# Install dependencies silently
python3 -m pip install -r requirements.txt --break-system-packages > /dev/null 2>&1
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > ../"$LOG_DIR"/price_prediction.log 2>&1 &
echo "Python Service initiated (Port 8000)."
cd ..

# 4. React Frontend
echo "Step 4: Starting React Frontend..."
cd frontend-react
if command -v npm &> /dev/null; then
    nohup npm run dev > ../"$LOG_DIR"/frontend.log 2>&1 &
    echo "React Frontend initiated (usually Port 5173)."
else
    echo "WARNING: npm not found. Skipping Frontend."
fi
cd ..

# 5. Java Microservices (Staggered & Memory Limited)
echo "Step 5: Starting Java Microservices..."

start_java_service() {
    local service_name=$1
    echo "Starting $service_name..."
    cd "$service_name"
    # Use --no-daemon to avoid leaking background memory
    nohup ./gradlew --no-daemon bootRun -Dspring-boot.run.jvmArguments="$JAVA_MEM_OPTS" > ../"$LOG_DIR"/"$service_name".log 2>&1 &
    cd ..
}

# Start Config and Eureka first as foundation
start_java_service "config-server"
echo "Waiting for Config Server..."
sleep 20

start_java_service "eureka-server"
echo "Waiting for Discovery Server..."
sleep 20

# Core operational services for Trade execution
CORE_SERVICES=("user-service" "order-service" "portfolio-service" "market-data")
for SERVICE in "${CORE_SERVICES[@]}"; do
    start_java_service "$SERVICE"
    sleep 5
done

# Remaining microservices
EXTRA_SERVICES=("api-gateway" "notification-service" "risk-service")
for SERVICE in "${EXTRA_SERVICES[@]}"; do
    start_java_service "$SERVICE"
    sleep 5
done

echo "=========================================================="
echo "Full project restart sequence initiated!"
echo "Memory Limit per Java Service: 256MB (Total ~2.5GB for all 9 services)"
echo "Check '$LOG_DIR/' for detailed background logs."
echo "=========================================================="
