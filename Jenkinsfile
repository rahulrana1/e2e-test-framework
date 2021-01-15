pipeline {

    agent any

    triggers {
        cron(getCronJobTime())
    }

    environment {
        ENVIRONMENT = getEnv_var()
        IMAGENAME = getImageName()
        DATACLEANUP_CONTAINER_NAME = getContainerName("dataCleanUp")
        TESTCAFE_CONTAINER_NAME = getContainerName("testCafe")
        BACKSTOPJS_CONTAINER_NAME = getContainerName("backStopJS")
        RAILSNODEJS_CONTAINER_NAME = getContainerName("railsNodejs")
        APPLICATION = "nameOfApp"
    }

    parameters {
        choice(
            name: 'DELETE_IMAGES_CONTAINERS',
            choices: ['true','false'],
            description: 'To skip image and container deletion')

        choice(
            name: 'ENABLE_VIDEO_RECORDING',
            choices: ['false','true'],
            description: 'An option to enable video recording')

        choice(
            name: 'EXECUTE_PARALLEL_TESTS',
            choices: ['true','false'],
            description: 'To trigger dataCleanUp and rails/nodejs in parallel')

        choice(
            name: 'EXECUTE_DATA_CLEANUP',
            choices: ['true' , 'false'],
            description: 'To run data cleanup before tests')

        choice(
            name: 'EXECUTE_RAILS_NODEJS_TESTS',
            choices: ['true' , 'false'],
            description: 'To run rails and nodejs tests')

        choice(
            name: 'EXECUTE_VISUAL_TESTS',
            choices: ['true' , 'false'],
            description: 'To run BackStopJS tests')

        choice(
            name: 'EXECUTE_TESTCAFE_TESTS',
            choices: ['true' , 'false'],
            description: 'To run TestCafe tests')

        choice(
            name: 'SEND_SLACK_MESSAGE',
            choices: ['true' , 'false'],
            description: 'To send results to slack')

        string(
            name: 'BRANCH',
            defaultValue: 'master',
            description: 'GIT branch for running tests')
    }

    stages {

        stage('🚜 GIT checkout') {
            steps {
                cleanWs()
                git branch: params.BRANCH,
                    credentialsId: 'savedGitCredentialsInJenkins',
                    url: 'Github URL'
            }
        }

        stage('🚜 Image & Container Cleanup') {
            when { expression { params.DELETE_IMAGES_CONTAINERS.toBoolean() } }
            steps {
                sh './go cleanup_stopped_image_container'
            }
        }

        stage('👷 Build Image') {
            steps{
                sh './go build_docker_image'
            }
        }

        stage('Parallel execution Rails&NodeJs and DataCleanUp') {
            when { expression { params.EXECUTE_PARALLEL_TESTS.toBoolean() } }
            parallel {
                stage('✅ Execute Rails&NodeJs tests') {
                    when { expression { params.EXECUTE_RAILS_NODEJS_TESTS.toBoolean() } }
                    steps{
                        sh './go execute_railsNodejs_tests_docker'
                    }

                    post{
                        always {
                            copyRailsNodejsReportFromDockerContainer()
                            publishReport('RailsNodejsReport', 'nodejs,rails', 'APITesting/reports/railsNodejs/html', 'nodejsNextHub.html,railsNextHub.html')
                        }
                    }
                }

                stage('✅ Data CleanUp') {
                    when { expression { params.EXECUTE_DATA_CLEANUP.toBoolean() } }
                    steps{
                        sh './go run_nexthub_data_cleanup_docker'
                    }
                }
            }
        }

        stage('✅ Execute Visual Tests') {
            when { expression { params.EXECUTE_VISUAL_TESTS.toBoolean() } }
            steps{
                echo env.ENVIRONMENT
                echo env.APPLICATION
                sh './go execute_visual_tests_docker'
                }

            post{
                always {
                    copyBackstopReportFromDockerContainer()
                    publishReport('Visual Test Reports', 'Visual Tests', 'backstopResults', 'html_report/index.html')
                }
            }
        }

        stage('✅ Execute TestCafe Tests') {
            when { expression { params.EXECUTE_TESTCAFE_TESTS.toBoolean() } }
            steps{
                echo env.ENVIRONMENT
                script{
                    if(params.ENABLE_VIDEO_RECORDING.toBoolean()) {
                        sh './go execute_testcafe_tests_docker_videos'
                    } else {
                        sh './go execute_testcafe_tests_docker'
                    }
                }
            }

            post{
                always {
                    copyTestCafeReportFromDockerContainer()
                    publishAllureReport('allure/allure-report', 'allure/allure-results')
                    sh 'npm run junit:merge'
                    junit testResults: 'reports/junit_consolidated.xml', allowEmptyResults: false
                    archiveVideos('reports/videos/*.mp4')
                }
            }
        }

        stage('🚜 Remove and Stop Image & Containers') {
            when { expression { params.DELETE_IMAGES_CONTAINERS.toBoolean() } }
            steps {
                sh './go remove_container_image_docker'
            }
        }

        stage('Send Results To Slack') {
            when { expression { params.SEND_SLACK_MESSAGE.toBoolean() } }
            steps{
                echo "send results to slack"
            }

            post{
                always {
                    sh 'npm install csv-parser'
                    sh 'npm run slack:report:txtfile'
                    slack currentBuild
                }
            }
        }
    }
}

def copyTestCafeReportFromDockerContainer(){

sh """
    cont=\$(docker ps -aqf "name="$TESTCAFE_CONTAINER_NAME"")
    docker cp \$cont:/app/allure allure
    docker cp \$cont:/app/reports/. reports
"""

}

def copyRailsNodejsReportFromDockerContainer(){

sh """
    cont=\$(docker ps -aqf "name="$RAILSNODEJS_CONTAINER_NAME"")
    docker cp \$cont:/app/APITesting/reports/railsNodejs/junit/. reports
    docker cp \$cont:/app/APITesting/reports/railsNodejs APITesting/reports
"""

}


def copyBackstopReportFromDockerContainer(){

sh """
    cont=\$(docker ps -aqf "name="$BACKSTOPJS_CONTAINER_NAME"")
    docker cp \$cont:/app/visualTest/backstop_data backstopResults
"""

}

def publishAllureReport(rawReportFolder, htmlresults){
    sh 'rm -rf allure/allure'
    script {
        allure([
            includeProperties: false,
            jdk: '',
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: htmlresults]],
            report: rawReportFolder
        ])
    }
}

def archiveVideos(path){
    script {
        archiveArtifacts([
            artifacts: path,
            followSymlinks: false,
            allowEmptyArchive: true
        ])
    }
}

def getContainerName(type) {
    def name = env.JOB_NAME
    def date = new Date()
    def timeInMillsecs = date.getTime()
    return name + "_" + type + "_" + timeInMillsecs
}

def getImageName() {
    def date = new Date()
    def timeInMillsecs = date.getTime()
    return "testcafeimage_" + timeInMillsecs
}

def getEnv_var() {
    def name = env.JOB_NAME

    if(name.contains('UAT')){
        return "UAT";
    }

    if(name.contains('TEST')){
        return "TEST";
    }

    if(name.contains('PROD')){
        return "PROD";
    }
}

def getCronJobTime() {
    def name = env.JOB_NAME

    //jobs with conatining no cron in the name won't everyday
    if(name.contains('noCron')){
        return "";
    }

    if(name.contains('UAT')){
        return "H 21 * * 1-5";
    }

    if(name.contains('TEST')){
        return "H 23 * * 1-5";
    }

    if(name.contains('PROD')){
        return "H 01 * * 1-5";
    }
}

def publishReport(name, titles, folder, files) {
    publishHTML(target: [
        allowMissing            : false,
        alwaysLinkToLastBuild   : true,
        keepAll                 : true,
        reportDir               : folder,
        reportFiles             : files,
        reportName              : name,
        reportTitles            : titles
    ])
}

def slack(currentBuild) {
    def colour = currentBuild.result == 'SUCCESS' ? 'good' : 'danger'
    def msgTestCafeSlack = readFile "./utils/slack/testCafeResultsForSlack.txt"
    def msgVisualTestSlack = readFile "./utils/slack/visualResultsForSlack.txt"
    def msgRailsNodejsTestSlack = readFile "./utils/slack/railsNodejsResultsForSlack.txt"

    echo "TestCafe Report message ${msgTestCafeSlack}"
    echo "Visual Report message ${msgVisualTestSlack}"

    def testcafeMsg = "*TestCafe Results in ${env.ENVIRONMENT}* : <${currentBuild.absoluteUrl}/allure/|Testcafe Report>\n${msgTestCafeSlack}"
    def visualTestMsg = "*Visual Test Results in ${env.ENVIRONMENT}* : <${currentBuild.absoluteUrl}/Visual_20Test_20Reports/|Visual Test Report>\n${msgVisualTestSlack}"
    def railsNodejsTestMsg = "*Rails/Nodejs Test Results in ${env.ENVIRONMENT}* : <${currentBuild.absoluteUrl}/RailsNodejsReport/|Rails/Nodejs Test Report>\n${msgRailsNodejsTestSlack}"

    def finalMessage = "${testcafeMsg}\n\n${visualTestMsg}\n\n${railsNodejsTestMsg}"

    slackSend channel: '#automation-testing', color: colour, message: finalMessage
}

