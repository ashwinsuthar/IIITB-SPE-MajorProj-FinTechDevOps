#!/bin/bash
# Configuration Ashwin Suthar MT2025024 - IIIT B SPE Major project FinTech JavaSpringBoot PythonFastAPI DevOps
echo "========== Stopping All Services (Host + Docker) =========="

# 1. Stop React JS / Vite processes
echo "Stopping React Frontend..."
pkill -u $(whoami) -f "vite" || true
pkill -u $(whoami) -f "npm run dev" || true
pkill -u $(whoami) -f "node.*frontend-react" || true

# 2. Stop Python Uvicorn process
echo "Stopping Python Price Prediction Service..."
pkill -u $(whoami) -f "uvicorn" || true

# 3. Stop all host-level Java services 
echo "Stopping Java Microservices (Host)..."
pkill -u $(whoami) -f "java" || true

# 4. Clean up dangling Gradle daemons
echo "Cleaning up dangling Gradle Daemons..."
pkill -u $(whoami) -f "gradlew" || true

# 5. Stop Docker containers using docker compose
echo "Stopping all Docker services..."
docker compose down

echo "========== System is completely offline =========="
