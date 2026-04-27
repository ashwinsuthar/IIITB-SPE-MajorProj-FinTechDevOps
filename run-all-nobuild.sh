#!/bin/bash
#testGItscm poll
# Configuration Ashwin Suthar MT2025024 - IIIT B SPE Major project FinTech JavaSpringBoot PythonFastAPI DevOps
LOG_DIR="logs"
mkdir -p "$LOG_DIR"

# Memory limit for each service - very strict to save RAM
JAVA_MEM_OPTS="-Xms64m -Xmx256m"
export GRADLE_OPTS="-Xmx512m"

echo "========== Stock Portfolio System: RAM OPTIMIZED RESTART =========="

# 1. Capture the start time
start_time=$(date +%s)
echo $(date -d "@$start_time" +"%T")
# 1. Cleanup Phase
echo "Step 1: Cleaning up existing processes..."
pkill -u $(whoami) -f java || true
pkill -u $(whoami) -f uvicorn || true
pkill -u $(whoami) -f "npm run dev" || true
pkill -u $(whoami) -f vite || true

# Kill any dangling gradlew processes in subdirectories
pkill -u $(whoami) -f gradlew || true

echo "Cleanup complete."

# 2. No Build Phase

# 3. Infrastructure (Docker)
echo "Step 3: Ensuring Docker Infrastructure is UP (with memory limits)..."
docker compose up -d

# 4. Python Service
echo "Step 4: Starting Python Price Prediction Service..."
cd price-prediction
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > ../"$LOG_DIR"/price_prediction.log 2>&1 &
echo "Python Service initiated (Port 8000)."
cd ..

# 5. React Frontend
echo "Step 5: Starting React Frontend..."
cd frontend-react
nohup npm run dev > ../"$LOG_DIR"/frontend.log 2>&1 &
echo "React Frontend initiated."
cd ..

# 6. Java Microservices (Direct JAR execution)
echo "Step 6: Starting Java Microservices (Direct JAR)..."

start_java_jar() {
    local service_folder=$1
    local jar_pattern=$2
    echo "Starting $service_folder..."
    
    # Locate the jar
    local jar_path=$(find "$service_folder/build/libs" -name "$jar_pattern" ! -name "*-plain.jar" | head -n 1)
    
    if [ -f "$jar_path" ]; then
        nohup java $JAVA_MEM_OPTS -jar "$jar_path" > "$LOG_DIR"/"$service_folder".log 2>&1 &
        echo "$service_folder started."
    else
        echo "ERROR: JAR not found for $service_folder at $jar_path"
    fi
}

# Start foundation services
start_java_jar "config-server" "config-server-*.jar"
echo "Waiting for Config Server..."
sleep 20

start_java_jar "eureka-server" "eureka-server-*.jar"
echo "Waiting for Discovery Server..."
sleep 20

# Core services
CORE_SERVICES=("user-service" "order-service" "portfolio-service" "market-data")
for SERVICE in "${CORE_SERVICES[@]}"; do
    start_java_jar "$SERVICE" "$SERVICE-*.jar"
    sleep 5
done

# Gateways and extra services
EXTRA_SERVICES=("api-gateway" "notification-service" "risk-service")
for SERVICE in "${EXTRA_SERVICES[@]}"; do
    start_java_jar "$SERVICE" "$SERVICE-*.jar"
    sleep 5
done

echo "=========================================================="
echo "Project restart sequence initiated with RAM optimization!"
echo "Total Java Services: 9 | Target RAM usage: ~2GB"
echo "Logs are in '$LOG_DIR/'"
echo "=========================================================="

# 2. Record end time
end_time=$(date +%s)
# 3. Calculate total elapsed seconds
elapsed=$(( end_time - start_time ))

# 4. Convert seconds into HH:MM:SS format
hours=$(( elapsed / 3600 ))
mins=$(( (elapsed % 3600) / 60 ))
secs=$(( elapsed % 60 ))

# 5. Print the result with leading zeros
printf "Total time: %02d:%02d:%02d\n" "$hours" "$mins" "$secs"