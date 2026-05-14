pipeline {
    agent any

    triggers {
        // Scm polling
        pollSCM('* * * * *')
        githubPush()
    }
//for now just comment below for running with no TBW around 10 GB  1hr success build
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
//TAconfirmed Build push in jenkinsfile and use Docker images in Ansible k8s deployment -AshwinS270426
        stage('Unit Testing Java Backend Services') {
            steps {
                script {
                    def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                    for (int i = 0; i < javaServices.size(); i++) {
                        def service = javaServices[i]
                        dir(service) {
                            echo "Running unit tests for ${service}..."
                            sh 'chmod +x ./gradlew || true'
                            sh './gradlew test --no-daemon || true'
                        }
                    }
                }
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

        stage('Build Push Docker Images') {
            steps {
                script {
                    echo "Logging into Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        
                        def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                        for (int i = 0; i < javaServices.size(); i++) {
                            def service = javaServices[i]
                            echo "Building and pushing ${service}..."
                            sh "docker build --no-cache -t ${env.DOCKER_REPO}:spestocksys-${service} ./${service}"
                            sh "docker push ${env.DOCKER_REPO}:spestocksys-${service}"
                        }
                        
                        echo "Building and pushing price-prediction..."
                        sh "docker build --no-cache -t ${env.DOCKER_REPO}:spestocksys-price-prediction ./price-prediction"
                        sh "docker push ${env.DOCKER_REPO}:spestocksys-price-prediction"
                        
                        echo "Building and pushing frontend-react..."
                        sh "docker build --no-cache -t ${env.DOCKER_REPO}:spestocksys-frontend-react ./frontend-react"
                        sh "docker push ${env.DOCKER_REPO}:spestocksys-frontend-react"
                    }
                }
            }
        }

        stage('Trivy Security Scan Java Services') {
            steps {
                script {
                    def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                    for (int i = 0; i < javaServices.size(); i++) {
                        def service = javaServices[i]
                        echo "Running Trivy Security Scan for ${service}..."
                        sh "trivy image --severity HIGH,CRITICAL --no-progress ${env.DOCKER_REPO}:spestocksys-${service} || true"
                    }
                }
            }
        }

        stage('Trivy Security Scan Python & Frontend') {
            steps {
                script {
                    echo "Running Trivy Security Scan for price-prediction..."
                    sh "trivy image --severity HIGH,CRITICAL --no-progress ${env.DOCKER_REPO}:spestocksys-price-prediction || true"
                    
                    echo "Running Trivy Security Scan for frontend-react..."
                    sh "trivy image --severity HIGH,CRITICAL --no-progress ${env.DOCKER_REPO}:spestocksys-frontend-react || true"
                }
            }
        }
//start minikube and deploy only builder job for building images -AshwinS270426
        stage('Start Minikube') {
            steps {
                script {
                    echo "Starting Minikube..."
                    //sh 'docker system prune -f || true'
                 // sh 'minikube start --ports 5173:5173 --force'
              //    sh 'minikube addons enable metrics-server || true'
                }
            }
        }
/*
        //TA confirmed NO Ansible build push docker images as JenkinsFileUseIt-AshwinS140526
        stage('Ansible - Build Push Docker Images') {
            steps {
                script {
                    echo "Deploying Builder Job to Kubernetes via Ansible..."
                    sh 'ansible-playbook ansible/playbook-build.yml'
                    echo "K8s Builder Job will build and push images to Docker Hub."
                }
            }
        } 
*/
  /*        Only Uncomment when want to run locally Docker testing 4GB ram ok-AshwinS270426
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
        } */

        stage('Deploy to Kubernetes using Ansible') {
            steps {
                script {
                    echo "Deploying application to Kubernetes via Ansible..."
                    sh 'ansible-playbook ansible/playbook.yml'
                }
            }
        }

//Pushing Docker images post successful local build run Succes

        // Push Docker Images stage removed as K8s job pushes images during the Build Docker Images stage

    }
}