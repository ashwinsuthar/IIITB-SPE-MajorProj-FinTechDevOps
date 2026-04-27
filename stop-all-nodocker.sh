#!/bin/bash

# Configuration Ashwin Suthar MT2025024 - IIIT B SPE Major project FinTech JavaSpringBoot PythonFastAPI DevOps test GitSCM
echo "========== Stopping Local Services (No-Docker) =========="

# 1. Stop React JS / Vite processes
echo "Stopping React Frontend..."
pkill -u $(whoami) -f "vite" || true
pkill -u $(whoami) -f "npm run dev" || true
pkill -u $(whoami) -f "node.*frontend-react" || true

# 2. Stop Python Uvicorn process (Price Prediction)
echo "Stopping Python Price Prediction Service..."
pkill -u $(whoami) -f "uvicorn" || true

# 3. Stop specific Java Microservices deployed from JARs
# By targeting the specific JAR names, we guarantee we DO NOT kill 
# the Java instances running inside Docker (like Elasticsearch, Kafka, or Zookeeper).
echo "Stopping Java Microservices (Host-only)..."

SERVICES=("config-server" "eureka-server" "user-service" "order-service" "portfolio-service" "market-data" "api-gateway" "notification-service" "risk-service")

for SERVICE in "${SERVICES[@]}"; do
    # Kills any process that matches the specific service JAR name
    pkill -u $(whoami) -f ".*$SERVICE-.*\.jar" || true
done

# 4. Clean up dangling Gradle daemons on the host
echo "Cleaning up dangling host Gradle Daemons..."
pkill -u $(whoami) -f "gradlew" || true
pkill -u $(whoami) -f "GradleDaemon" || true

echo "========== All local host services stopped safely =========="
