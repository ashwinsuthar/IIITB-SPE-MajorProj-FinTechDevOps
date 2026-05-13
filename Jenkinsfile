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

  /*      stage('Build Java Backend Services') {
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
        }*/

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

  /*      stage('Build Docker Images') {
            steps {
                script {
                    echo "Deploying Builder Job to Kubernetes via Ansible..."
                    sh 'ansible-playbook ansible/playbook-build.yml'
                    echo "K8s Builder Job will build and push images to Docker Hub."
                }
            }
        } */

  /*      stage('Run Locally') {
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

        stage('Deploy to Kubernetes') {
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