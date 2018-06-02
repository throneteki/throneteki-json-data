pipeline {
    agent any

    environment {
        GIT_EMAIL = sh (script: 'git --no-pager show -s --format=\'%ae\'', returnStdout: true).trim()
        GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
        GIT_NAME=sh (script: 'git --no-pager show -s --format=\'%an\'', returnStdout: true).trim()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'node -v'
                sh 'npm prune'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
    }

    post {
        success {
            script {
                previousBuild = currentBuild.getPreviousBuild()
                if(previousBuild && !previousBuild.result.toString().equals('SUCCESS')) {
                    mail body: "Hello ${GIT_NAME},\n\nI'm please to report that the throneteki-json-data build is now working again.  Please find details of the build here:\n\n${env.BUILD_URL}\n\nKind regards,\nThe Iron Throne Build Server",
                    from: 'The Iron Throne Build Server <jenkins@theironthrone.net>',
                    replyTo: 'noreply@theironthrone.net',
                    subject: "throneteki-json-data build #${env.BUILD_NUMBER} fixed (${env.BRANCH_NAME} - ${GIT_COMMIT_HASH})",
                    to: GIT_EMAIL
                }
            }
        }
        failure {
            script {
                previousBuild = currentBuild.getPreviousBuild()
                if(!previousBuild || previousBuild.result.toString().equals('SUCCESS')) {
                    BUILD_STATUS_SUBJECT='broken'
                    BUILD_STATUS='now broken'
                } else {
                    BUILD_STATUS_SUBJECT='still broken'
                    BUILD_STATUS='still broken'
                }
            }

            mail body: "Hello ${GIT_NAME},\n\nI'm sorry to report that the throneteki-json-data build is ${BUILD_STATUS}.  Please see details of the breakage here:\n\n${env.BUILD_URL}\n\nKind regards,\nThe Iron Throne Build Server",
            from: 'The Iron Throne Build Server <jenkins@theironthrone.net>',
            replyTo: 'noreply@theironthrone.net',
            subject: "throneteki-json-data build #${env.BUILD_NUMBER} ${BUILD_STATUS} (${env.BRANCH_NAME} - ${GIT_COMMIT_HASH})",
            to: GIT_EMAIL
        }
    }
}