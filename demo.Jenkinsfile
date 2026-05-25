pipeline {

  agent any

  options {
    ansiColor('xterm')
  }

  environment {
    BUILD_TARGET = 'demo'
  }

  stages {

    stage('Notify') {
      steps {
        slackSend (message: "Build Started - ${env.JOB_NAME} ${env.BUILD_NUMBER}: ${BRANCH} (<${env.BUILD_URL}|Jenkins>)", color: "good")
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
        sh 'rm -rf /opt/evkk/* && cp -r ./build/* /opt/evkk'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker system prune --force --volumes && cd /opt/evkk && ./run.sh'
      }
    }

  }

  post {

    success {
      slackSend (message: "Build Success - ${env.JOB_NAME} ${env.BUILD_NUMBER}: ${BRANCH} (<https://praktika1.cs.tlu.ee|praktika1.cs.tlu.ee>)", color: "good")
    }

    failure {
      slackSend (message: "Build Failure - ${env.JOB_NAME} ${env.BUILD_NUMBER}: ${BRANCH} (<${env.BUILD_URL}|Jenkins>)", color: "danger")
    }

  }

}
