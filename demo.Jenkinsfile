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

    stage('Test') {
      steps {
        // Runs tests in JDK 11 (Gradle 5.6.4 can't run on the host's newer JDK) with Redis, Postgres and Stanza
        sh 'bash ./ci-test.sh'
      }
      post {
        always {
          junit '**/build/test-results/**/*.xml'
        }
      }
    }

    stage('Build') {
      steps {
        withCredentials([
          string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY'),
          string(credentialsId: 'ga-measurement-id-demo', variable: 'GA_MEASUREMENT_ID')
        ]) {
          sh '''
            ./build.sh
            printf '\nGEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" >> ./build/conf/common.env
          '''
        }
        script {
          if (params.RESET_DATABASE) {
            echo 'RESET_DATABASE is set: the demo database will be wiped and re-created'
            sh "sed -i 's/^EVKK_DB_FLYWAY_COMMANDS=.*/EVKK_DB_FLYWAY_COMMANDS=clean,migrate,seed/' ./build/conf/db.env"
          }
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
