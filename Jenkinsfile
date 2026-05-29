pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/shubhammkbd17/taskflow.git'
            }
        }

        stage('CI/CD Test Change') {
            steps {
                echo 'TaskFlow CI/CD Pipeline Updated'
            }
        }

        stage('Verify Repository') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }
    }
}