const fs = require('fs');
const csv = require('csv-parser')

async function readAllureResults_CSV() {

    const csvFilePath = './allure/allure-report/data/behaviors.csv'
    let report
    try {
        fs.accessSync(csvFilePath)
        return new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    report = row
                })
                .on('end', () => {
                    resolve(report)
                });
        })
    }
    catch (err) {
        report = "Not Found"
        console.log("Allure results not found! ",report)
        return report
    }
}

function readRailsNodejs_results() {
    const nodejsResultsFilePath = './APITesting/reports/railsNodejs/json/railsNextHub.json'
    const railsResultsFilePath = './APITesting/reports/railsNodejs/json/nodejsNextHub.json'

    let report
    try {
        fs.accessSync(nodejsResultsFilePath)
        fs.accessSync(railsResultsFilePath)

        const nodejs_jsonResults = require('../../APITesting/reports/railsNodejs/json/nodejsNextHub.json')
        const rails_jsonResults = require('../../APITesting/reports/railsNodejs/json/railsNextHub.json')

        const nodeJs_totalRequests = nodejs_jsonResults.run.stats.requests.total
        const nodeJs_totalTests = nodejs_jsonResults.run.stats.assertions.total
        const nodeJs_failedTests = nodejs_jsonResults.run.stats.assertions.failed
        const rails_totalRequests = rails_jsonResults.run.stats.requests.total
        const rails_totalTests = rails_jsonResults.run.stats.assertions.total
        const rails_failedTests = rails_jsonResults.run.stats.assertions.failed


        const objStatus = {
            totalRequestsNodejs: nodeJs_totalRequests,
            totalTestsNodejs: nodeJs_totalTests,
            failTestsNodejs: nodeJs_failedTests,
            totalRequestsRails: rails_totalRequests,
            totalTestsRails: rails_totalTests,
            failTestsRails: rails_failedTests,
        }

        return objStatus
    }
    catch (err) {
        report = "Not Found"
        console.log("rails/nodejs json files ", report)
        return report
    }
}

function getVisualTestResults() {
    const visualresultsFilePath = './backstopResults/json_report/jsonReport.json'
    let report

    try {
        fs.accessSync(visualresultsFilePath)
        const visualTestJson = require('../../backstopResults/json_report/jsonReport.json')
        //const visualTestJson = require('../../visualTest/backstop_data/json_report/jsonReport.json')
        const fail = visualTestJson.tests.filter(test => test.status === 'fail').length
        const pass = visualTestJson.tests.filter(test => test.status === 'pass').length

        const objStatus = {
            pass: pass,
            fail: fail
        }
        return objStatus
    }
    catch (err) {
        report = "Not Found"
        console.log("Visual test json results not found! ",report)
        return report
    }
}


async function writeTestCafeResultsInTextFile() {
    const res = await readAllureResults_CSV()
    const resultsTestCafeFilePath = 'utils/slack/testCafeResultsForSlack.txt'

    if (res === 'Not Found') {
        return fs.writeFile(resultsTestCafeFilePath, 'TestCafe results not found! Please check the console logs to find more info.', (error) => {
            if (error) throw error;
        });
    }

    if (res != 'Not Found') {
        const passed = parseInt(res.PASSED)
        const failed = parseInt(res.FAILED) + parseInt(res.BROKEN)
        const skipped = parseInt(res.SKIPPED)

        const emoji = emojis(passed, failed, skipped)

        const resultTestCafeForSlack = `${emoji}\n:white_check_mark: *Passed* : ${res.PASSED}\n:no_entry: *Failed*: ${res.FAILED}\n:fast_forward: *Skipped*: ${res.SKIPPED}\n:broken_heart: *Broken*: ${res.BROKEN}`

        fs.writeFile('utils/slack/testCafeResultsForSlack.txt', resultTestCafeForSlack, (error) => {
            if (error) throw error;
        });
    }
}

async function writeVisualTestResults() {
    const resVisual = getVisualTestResults()
    const visualResultsFilePath= 'utils/slack/visualResultsForSlack.txt'

    if (resVisual === 'Not Found') {
        return fs.writeFile(visualResultsFilePath, 'Visual test results not found! Please check the console logs to find more info.', (error) => {
            if (error) throw error;
        });
    }

    const emoji = emojis(resVisual.pass, resVisual.fail)

    const resultsVisualTestForSlack = `${emoji}\n:white_check_mark: *Passed* : ${resVisual.pass}\n:no_entry: *Failed*: ${resVisual.fail}\n`

    fs.writeFile(visualResultsFilePath, resultsVisualTestForSlack, (error) => {
        if (error) throw error;
    });
}

async function writeRailsNodejsTestResults() {
    const resRailsNodejs = readRailsNodejs_results()
    const railsNodejsResultsFilePath = 'utils/slack/railsNodejsResultsForSlack.txt'
    const railsPassedTests = resRailsNodejs.totalTestsRails - resRailsNodejs.failTestsRails
    const nodejsPassedTests = resRailsNodejs.totalTestsNodejs - resRailsNodejs.failTestsNodejs

    if (resRailsNodejs === 'Not Found') {
        return fs.writeFile(railsNodejsResultsFilePath, 'RailsNodejs test results not found! Please check the console logs to find more info.', (error) => {
            if (error) throw error;
        });
    }

    const railsresultsForSlack = `\n:white_check_mark: *Rails_TotalRequests* : ${resRailsNodejs.totalRequestsRails}\n:no_entry: *Rails_FailedTests* : ${resRailsNodejs.failTestsRails}/${resRailsNodejs.totalTestsRails}`
    const nodejsResultsForSlack = `\n:white_check_mark: *Nodejs_TotalRequests* : ${resRailsNodejs.totalRequestsNodejs}\n:no_entry: *NodeJs_FailedTests*: ${resRailsNodejs.failTestsNodejs}/${resRailsNodejs.totalTestsNodejs}`
    const rails_nodejsResults = `${railsresultsForSlack}\n${nodejsResultsForSlack}`

    fs.writeFile(railsNodejsResultsFilePath, rails_nodejsResults, (error) => {
        if (error) throw error;
    });
}

function emojis(pass, fail, skip=0) {
    const totalTests = pass + fail + skip;
    const passRate = (pass / totalTests) * 100
    console.log("pass Rate = ", passRate)
    let emoji

    if ((fail === 0 && skip === 0) || (passRate >= 99 && passRate <= 100)) {
        emoji = `:fiesta_parrot:`
    }

    if (passRate >= 90 && passRate < 99) {
        emoji = `:panda-dance:`
    }

    if (passRate >= 85 && passRate < 90) {
        emoji = `:neutral_face:`
    }

    if (passRate >= 80 && passRate < 85) {
        emoji = `:face_with_raised_eyebrow:`
    }
    if (passRate >= 60 && passRate < 80) {
        emoji = `:computerrage:`
    }

    if (passRate < 60) {
        emoji = `:ghost::computerrage::smiling_imp::japanese_goblin::male_zombie:`
    }

    if (typeof passRate === 'undefined') {
        emoji = ''
    }
    return emoji

}

writeTestCafeResultsInTextFile()
writeVisualTestResults()
writeRailsNodejsTestResults()
