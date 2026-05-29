pipeline {
    agent any

    stages {

        stage('Verify Repository') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Build Simulation') {
            steps {
                echo 'Docker build simulated'
            }
        }

        stage('Deploy Simulation') {
            steps {
                echo 'Deployment simulated'
            }
        }
    }
}