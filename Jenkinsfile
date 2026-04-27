pipeline {
    agent any

    triggers {
        // Scm polling
        pollSCM('* * * * *')
        githubPush()
    }

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
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

        stage('Build & Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        
                        // 1. Java Services
                        def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                        for (int i = 0; i < javaServices.size(); i++) {
                            def service = javaServices[i]
                            dir(service) {
                                echo "Dockerizing ${service}..."
                                def javaImage = docker.build("${env.DOCKER_REPO}:spestocksys-${service}")
                                javaImage.push()
                            }
                        }
                        
                        // 2. Python Service
                        dir('price-prediction') {
                            echo "Dockerizing price-prediction..."
                            def pythonImage = docker.build("${env.DOCKER_REPO}:spestocksys-price-prediction")
                            pythonImage.push()
                        }
                        
                        // 3. React Frontend Service
                        dir('frontend-react') {
                            echo "Dockerizing frontend-react..."
                            def reactImage = docker.build("${env.DOCKER_REPO}:spestocksys-frontend-react")
                            reactImage.push()
                        }
                    }
                }
            }
        }
    }
}
