pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_IMAGE = 'myrepo/market-data-service'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/myorg/stock-portfolio.git'
            }
        }

        stage('Build Java Backend') {
            steps {
                dir('market-data') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Run Automated Tests') {
            steps {
                dir('market-data') {
                    sh './mvnw test'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                dir('market-data') {
                    script {
                        docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                            def customImage = docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                            customImage.push()
                            customImage.push('latest')
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/market-data market-data=${DOCKER_IMAGE}:${env.BUILD_ID}'
            }
        }
    }
}
