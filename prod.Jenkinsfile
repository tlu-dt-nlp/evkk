pipeline {

  agent any

  options {
    ansiColor('xterm')
  }

  environment {
    BUILD_TARGET = 'prod'
    // Unique image tag per build (prefixed, since demo and prod builds share the Jenkins host's images), used by Swarm to detect changes and roll back
    IMAGE_TAG = "${BUILD_TARGET}-${env.BUILD_NUMBER}"
    // Optional DEPLOY_HOST job parameter overrides the server
    DEPLOY_HOST = "${params.DEPLOY_HOST?.trim() ?: 'praktika2.cs.tlu.ee'}"
  }

  stages {

    stage('Notify') {
      steps {
        slackSend (message: "Build Started - ${env.JOB_NAME} ${env.BUILD_NUMBER}: ${DEPLOY_HOST} (<${env.BUILD_URL}|Jenkins>)", color: "good")
      }
    }

    stage('Backend tests') {
      steps {
        // Runs tests in JDK 11 (Gradle 5.6.4 can't run on the host's newer JDK) with Redis, Postgres and Stanza
        sh 'bash ./ci-backend-test.sh'
      }
      post {
        always {
          junit '**/build/test-results/**/*.xml'
        }
      }
    }

    stage('UI tests') {
      steps {
        // Runs Vitest tests in the same Node image the UI is built with
        sh 'bash ./ci-ui-test.sh'
      }
      post {
        always {
          junit 'ui/test-results/*.xml'
        }
      }
    }

    stage('Build') {
      steps {
        withCredentials([
          string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY'),
          string(credentialsId: 'ga-measurement-id-prod', variable: 'GA_MEASUREMENT_ID')
        ]) {
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
          sh "scp -o StrictHostKeyChecking=no -r ./build/* evkk@${DEPLOY_HOST}:/opt/evkk"
        }
      }
    }

    stage('Deploy') {
      steps {
        sshagent (credentials: ['deploy']) {
          sh "ssh -o StrictHostKeyChecking=no evkk@${DEPLOY_HOST} 'cd /opt/evkk/ && ./run.sh && docker system prune --force --volumes'"
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
