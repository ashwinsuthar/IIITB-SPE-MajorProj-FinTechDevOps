#!/bin/bash
set -e

# Repository settings
REPO="ashwins1/spe-stocksys-mjproj"

# 1. Java Services using bootBuildImage
JAVA_SERVICES=("config-server" "eureka-server" "user-service" "order-service" "portfolio-service" "market-data" "api-gateway" "notification-service" "risk-service")

echo "========== Building and Pushing Java Services =========="
for SERVICE in "${JAVA_SERVICES[@]}"; do
    echo "-> Processing Java Service: $SERVICE"
    cd "$SERVICE"
    IMAGE_NAME="$REPO:spestocksys-$SERVICE"
    
    # Pre-build using gradle
    if [ ! -f "gradlew" ] && [ -f "../gradlew" ]; then
        ../gradlew build -x test --no-daemon
    else
        ./gradlew build -x test --no-daemon
    fi
    
    echo "-> Building image: $IMAGE_NAME"
    docker build -t "$IMAGE_NAME" .
    
    echo "-> Pushing image: $IMAGE_NAME"
    docker push "$IMAGE_NAME"
    cd ..
done

# 2. Python Service
echo "========== Building and Pushing Python Service =========="
cd price-prediction
PYTHON_IMAGE="$REPO:spestocksys-price-prediction"
echo "-> Building image: $PYTHON_IMAGE"
docker build -t "$PYTHON_IMAGE" .
echo "-> Pushing image: $PYTHON_IMAGE"
docker push "$PYTHON_IMAGE"
cd ..

# 3. React Frontend Service
echo "========== Building and Pushing React Service =========="
cd frontend-react
REACT_IMAGE="$REPO:spestocksys-frontend-react"
echo "-> Building image: $REACT_IMAGE"
docker build -t "$REACT_IMAGE" .
echo "-> Pushing image: $REACT_IMAGE"
docker push "$REACT_IMAGE"
cd ..

echo ""
echo "=========================================================="
echo "Successfully built and pushed all project images!"
echo "Repository: $REPO"
echo "Base Tag: spestocksys"
echo "=========================================================="
