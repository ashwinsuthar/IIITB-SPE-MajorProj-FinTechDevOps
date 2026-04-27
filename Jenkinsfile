pipeline {
    agent any

    triggers {
        // Scm polling
        pollSCM('* * * * *')
        githubPush()
    }
//for now just comment below for running with no TBW around 10 GB  1hr success build
/*
    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        GITHUB_CREDS_ID = 'github-pat-credentials'
        DOCKER_REPO = 'ashwins1/spe-stocksys-mjproj'
        GIT_URL = 'https://github.com/ashwinsuthar/IIITB-SPE-MajorProj-FinTechDevOps.git'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: env.GITHUB_CREDS_ID, 
                    url: env.GIT_URL
            }
        }

        stage('Build Java Backend Services') {
            steps {
                script {
                    def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                    for (int i = 0; i < javaServices.size(); i++) {
                        def service = javaServices[i]
                        dir(service) {
                            echo "Building ${service}..."
                            sh 'chmod +x ./gradlew || true'
                            sh './gradlew build -x test --no-daemon'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // 1. Java Services
                    def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                    for (int i = 0; i < javaServices.size(); i++) {
                        def service = javaServices[i]
                        dir(service) {
                            echo "Dockerizing ${service}..."
                            docker.build("${env.DOCKER_REPO}:spestocksys-${service}", "--no-cache .")
                        }
                    }
                    
                    // 2. Python Service
                    dir('price-prediction') {
                        echo "Dockerizing price-prediction..."
                        docker.build("${env.DOCKER_REPO}:spestocksys-price-prediction", "--no-cache .")
                    }
                    
                    // 3. React Frontend Service
                    dir('frontend-react') {
                        echo "Dockerizing frontend-react..."
                        docker.build("${env.DOCKER_REPO}:spestocksys-frontend-react", "--no-cache .")
                    }
                }
            }
        }
*/
        stage('Run Locally') {
            steps {
                script {
                    echo "Starting infrastructure..."
                    sh 'docker compose -f docker-compose.yml up -d'
                    
                    echo "Starting application containers..."
                    sh 'docker compose -f docker-compose-app.yml up -d'
                    
                    echo "Waiting 30 seconds for services to initialize..."
                    sleep 30
                    
                    sh 'docker ps'
                }
            }
        }


//Pushing Docker images post successful local build run Success #11 (Apr 28, 2026, 2:58:08 AM)
/*
        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                        for (int i = 0; i < javaServices.size(); i++) {
                            def service = javaServices[i]
                            docker.image("${env.DOCKER_REPO}:spestocksys-${service}").push()
                        }
                        
                        docker.image("${env.DOCKER_REPO}:spestocksys-price-prediction").push()
                        docker.image("${env.DOCKER_REPO}:spestocksys-frontend-react").push()
                    }
                }
            }
        }
    }
}
*/