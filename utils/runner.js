const createTestCafe = require("testcafe");
const glob = require("glob-promise");
const BrowserStack = require("browserstack");
const chalk = require("chalk");
require('dotenv/config');

/*/ Each sub array defines a batch of browserstack workers.
 Our current plan allows for a max of 5 workers at a time,
 so to avoid crashing browserstack we group our browsers
 into 2 batches that run will run consecutively. /*/
const browserStackCredentials = {
    username: process.env.BROWSERSTACK_USERNAME,
    password: process.env.BROWSERSTACK_PASSWORD
  };

    async function getRunningBrowserstackSessions() {
        const client = BrowserStack.createClient(browserStackCredentials);
        const workerStatus = await new Promise(function(resolve, reject) {
          client.getApiStatus((error, workers) => {
            if (error) reject(error);
            else resolve(workers);
          });
        });
        return workerStatus;
    }
    
    async function getFiles(globPattern) {
        return await glob(globPattern)
            .then(files => files)
            .catch(e => console.error(e));
    }
    
    export async function createTestCafeInstance(browsers, testFiles, concurrencyCount, browserMetaData, deviceMetaData, reporter) {
        let testcafe;
        await createTestCafe()
            .then(tc => {
            testcafe = tc;
            return tc
                .createRunner()
                .src(testFiles)
                .filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
                  if(browserMetaData === 'chrome'){
                    return testMeta.browser === 'chrome' || testMeta.browser === 'all'
                  }
                  else if (browserMetaData === 'all') {
                    return testMeta.browser ==='all'
                  }
                  else if (deviceMetaData === 'all')
                    return testMeta.device ==='all'
                })
                .browsers(browsers)
                .reporter(reporter)
                .concurrency(concurrencyCount)
                .run();
            })
            .then(failedCount => {
            console.log("Tests failed: " + failedCount);
            testcafe.close();
        })
        .catch(err => console.error(err));
    }
    
    export async function startTests(browsers, createTestCafeInstance, concurrencyCount, browserMetaData, deviceMetaData, reporter) {
      // The testcafe node api does not accept glob patterns, so grab relevant test files using node-glob
        let files = await getFiles("./tests/nexthub/*.js");
        console.log("files.length",files.length)
      //Check that there are no tests already running
        let sessionInfo = await getRunningBrowserstackSessions();
        if (sessionInfo.running_sessions !== 0) {
            console.error(
            chalk.red(
            "There are not enough available Browserstack workers to run these tests. \nPlease cancel any running sessions from the Browserstack Automate dashboard and try again. \n"
            )
        );
        } else {
        // Create a new testcafe instance for each batch of browsers

            for (let i = 0; i < browsers.length; i++) {
                await createTestCafeInstance(browsers[i], files, concurrencyCount, browserMetaData, deviceMetaData, reporter);
            }
        }
    }
 


