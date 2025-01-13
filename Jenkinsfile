pipeline {
    agent any


    environment {
        DOCKER_IMAGE = 'my-web-app'
        DOCKER_USERNAME = 'simonyauwl'
        DOCKER_CREDENTIALS_ID = 'docker-cred-id'  // Jenkins credentials ID
        DEPLOY_ENV ='production'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Get code from repository
                checkout scm
            }
        }

        stage('Create New Tag') {
            steps {
                script {
                    echo "Repository URL: \$(git config --get remote.origin.url)"
                       // Debug Git information
                        sh """
                            echo "Debug Git Information:"
                            echo "Current directory: \$(pwd)"
                            echo "Git remote URLs:"
                            git remote -v
                            echo "Current branch:"
                            git branch
                            echo "All tags:"
                            git tag -l
                            echo "Git status:"
                            git status
                        """
                    sh "git fetch --tags"
                    // Get the latest tag
                    def latestTag = sh(returnStdout: true, script: 'git describe --tags --abbrev=0').trim()
                    
                    // Parse version numbers
                    def (major, minor, patch) = latestTag.replaceAll('v', '').tokenize('.')
                    
                    // Increment patch version
                    def newPatch = patch.toInteger() + 1
                    def newTag = "v${major}.${minor}.${newPatch}"
                    
                      // Store the new tag for later use
                    env.NEW_TAG = newTag

                    // Create and push new tag
                 
                    withCredentials([usernamePassword(credentialsId: 'github-login', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        // Get the repository URL and modify it
                        def repoUrl = sh(script: 'git config --get remote.origin.url', returnStdout: true).trim()
                        def repoPath = repoUrl.replaceAll('https://github.com/', '')
                        
                        sh """
                            git config --global user.email "simon_yau@hotmail.com.hk"
                            git config --global user.name "${GIT_USERNAME}"
                            git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${repoPath}
                            git tag ${newTag}
                            git push origin ${newTag}
                        """
                    }
                    echo "Created new tag: ${newTag}"
                }
            }
            
        }

        stage('Verify Tag') {
            steps {
                script {
                    echo "Verifying NEW_TAG value: ${env.NEW_TAG}"
                    if (!env.NEW_TAG) {
                        error("NEW_TAG is not set!")
                    }
                }
            }
        }


        stage('Create Version File') {
            steps {
                script {
                    // Create a version.json file before building
                    sh """
                        echo '{"version": "${env.NEW_TAG}"}' > src/version.json
                    """
                }
            }
        }
        stage('Login Docker') {
            steps {
                script {
                   // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    }

                }
            }
        }
        
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build --build-arg env=${DEPLOY_ENV} -t ${DOCKER_IMAGE} .'
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    // Tag with Git version
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${env.NEW_TAG}"
                    // Tag the Docker image
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_USERNAME}/${DOCKER_IMAGE}"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Push the tagged image to Docker Hub
                    sh "docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${env.NEW_TAG}"
                    sh "docker push  ${DOCKER_USERNAME}/${DOCKER_IMAGE}"
                }
            }
        }

        
        stage('Clean Up') {
            steps {
                // Remove local Docker images
                sh "docker rmi ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${env.NEW_TAG}"
                sh "docker rmi  ${DOCKER_USERNAME}/${DOCKER_IMAGE}:latest"
            }
        }
    }
    
    post {
        always {
            // Clean workspace
            cleanWs()
        }
    }
}

