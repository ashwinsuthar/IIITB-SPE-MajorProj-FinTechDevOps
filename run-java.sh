#!/bin/bash

# Cleanup existing Java processes to prevent duplicates and high RAM usage
echo "Cleaning up existing Java processes..."
pkill -u $(whoami) -f java || true
./gradlew --stop || true

mkdir -p logs

# Memory limit for each service - very strict to save RAM
# We use --no-daemon to avoid background daemon memory leakage
MEM_OPTS="-Xms64m -Xmx256m"
export GRADLE_OPTS="-Xmx256m"

echo "Starting config-server..."
cd config-server
nohup ./gradlew --no-daemon bootRun -Dspring-boot.run.jvmArguments="$MEM_OPTS" > ../logs/config-server.log 2>&1 &
cd ..

# wait a few seconds for config to start
sleep 20

echo "Starting eureka-server..."
cd eureka-server
nohup ./gradlew --no-daemon bootRun -Dspring-boot.run.jvmArguments="$MEM_OPTS" > ../logs/eureka-server.log 2>&1 &
cd ..

sleep 20

# Essential services for the current UI functionality
SERVICES=("api-gateway" "user-service" "order-service" "portfolio-service" "market-data")

echo "Starting essential services..."
for SERVICE in "${SERVICES[@]}"; do
    echo "Starting $SERVICE..."
    cd $SERVICE
    nohup ./gradlew --no-daemon bootRun -Dspring-boot.run.jvmArguments="$MEM_OPTS" > ../logs/$SERVICE.log 2>&1 &
    cd ..
    sleep 5 # stagger startup to avoid CPU spikes
done

echo "Services started with strict memory limits (Xmx256m) and --no-daemon!"
echo "Check logs/ directory for outputs."
