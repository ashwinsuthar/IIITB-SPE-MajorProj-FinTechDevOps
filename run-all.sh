#!/bin/bash

# Create logs directory
mkdir -p logs

echo "========== Starting Stock Portfolio System =========="

echo "1. Starting Docker Infrastructure (Postgres, Redis, Kafka, Zookeeper, ELK, Vault)..."
docker compose up -d

echo "2. Setting up Python FastAPI Price Prediction Service..."
cd price-prediction
# If pip isn't available globally, you might need a virtualenv. 
# We'll run it explicitly
python3 -m pip install -r requirements.txt --break-system-packages > /dev/null 2>&1
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > ../logs/price_prediction.log 2>&1 &
echo "Python Service started on port 8000 (PID: $!). Background log: logs/price_prediction.log"
cd ..

echo "3. Setting up React Frontend..."
cd frontend-react
# Ensure npm is installed (if it fails, the user must install it)
if command -v npm &> /dev/null
then
    npm install > /dev/null 2>&1
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    echo "React Frontend started. Background log: logs/frontend.log"
else
    echo "ERROR: npm could not be found. Please install Node.js/npm."
fi
cd ..

echo "======================================================"
echo "Project components have been initiated in the background."
echo "Note: The Java Spring Boot Microservices require detailed 'application.yml' configurations"
echo "(like Postgres passwords and Kafka URLs) before they can be ran successfully locally."
echo "If you wish to test a specific Java service, navigate to its folder and run: ./mvnw spring-boot:run"
