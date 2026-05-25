pipeline {

  agent any

  options {
    ansiColor('xterm')
  }

  environment {
    BUILD_TARGET = 'prod'
  }

  stages {

    stage('Notify') {
      steps {
        slackSend (message: "Build Started - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Jenkins>)", color: "good")
      }
    }

    stage('Build') {
      steps {
        withCredentials([string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY')]) {
          sh '''
            ./build.sh
            printf '\nGEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" >> ./build/conf/common.env
          '''
        }
      }
    }

    stage('Copy files') {
      steps {
        sshagent (credentials: ['deploy']) {
          sh "scp -o StrictHostKeyChecking=no -r ./build/* evkk@praktika2.cs.tlu.ee:/opt/evkk"
        }
      }
    }

    stage('Deploy') {
      steps {
        sshagent (credentials: ['deploy']) {
          sh "ssh -o StrictHostKeyChecking=no evkk@praktika2.cs.tlu.ee 'docker system prune --force --volumes && cd /opt/evkk/ && ./run.sh'"
        }
      }
    }

  }

  post {

    success {
      slackSend (message: "Build Success - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<https://elle.tlu.ee|elle.tlu.ee>)", color: "good")
    }

    failure {
      slackSend (message: "Build Failure - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Jenkins>)", color: "danger")
    }

  }

}
