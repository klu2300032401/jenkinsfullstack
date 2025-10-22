pipeline {
    agent any

    stages {

        // ===== FRONTEND BUILD =====
        stage('Build Frontend') {
            steps {
                dir('FRONTEND') { // folder where package.json exists
                    echo "Installing frontend dependencies..."
                    bat 'npm install'

                    echo "Building frontend..."
                    bat 'npm run build'
                }
            }
        }

        // ===== FRONTEND DEPLOY =====
        stage('Deploy Frontend to Tomcat') {
            steps {
                dir('FRONTEND') { // stay in same folder as build output
                    echo "Deploying frontend to Tomcat..."
                    bat '''
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\frontendapi" (
                        rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\frontendapi"
                    )
                    mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\frontendapi"
                    xcopy /E /I /Y dist\\* "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\frontendapi"
                    '''
                }
            }
        }

        // ===== BACKEND BUILD =====
        stage('Build Backend') {
            steps {
                dir('BACKEND') { // folder where pom.xml exists
                    echo "Building backend..."
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        // ===== BACKEND DEPLOY =====
        stage('Deploy Backend to Tomcat') {
            steps {
                echo "Deploying backend to Tomcat..."
                bat '''
                if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\backendapi.war" (
                    del /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\backendapi.war"
                )
                if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\backendapi" (
                    rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\backendapi"
                )
                copy "BACKEND\\target\\*.war" "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\"
                '''
            }
        }

    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Pipeline Failed.'
        }
    }
}
