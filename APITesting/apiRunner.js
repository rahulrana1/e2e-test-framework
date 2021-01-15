var newman = require('newman');
var expect = require('expect.js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const environment = process.env.ENVIRONMENT.toLowerCase()

class dataCleanUp {

    /*
        This function uses postman collection and env variables to trigger the API's to clean up data.
        @param {folder}  array   -   folders to execute from the postman collection.
    */
    async cleanUpData(folder) {
        const d = new Date()
        const timeInMilliSecs = d.getTime();
        const resultsFileName = `cleanUpData_${timeInMilliSecs}`
        const objConfig = config(folder, resultsFileName)
        return new Promise((resolve, reject) => {
            newman.run({
                ...objConfig
            }, function (err, summary) {
                if (err) {
                    console.log(err)
                }
                resolve(summary)
            });
        })
    }

    /**
    */
    async advisorLoginAndStoreCookies() {
        const folder = ['Advisor login']
        const objConfig = config(folder, 'advisorLoginAndStoreCookies')
        return new Promise((resolve, reject) => {
            newman.run({
                ...objConfig,
                exportEnvironment: `path/of/postmanenvfile\basedOnEnv`
            }, function (err, summary) {
                if (err) {
                    console.log(err)
                }
                resolve(summary)
            });
        })
    }

    /**
    */
    async createTemplateDashboard(folder, clientGroupName, connectionName, templateName) {
        const objConfig = config(folder, 'createTemplateDashboard_results')
        return new Promise((resolve, reject) => {
            newman.run({
                ...objConfig,
                envVar: [
                    { "key": "nameOfKey", "value": clientGroupName },
                    { "key": "nameOfKey", "value": connectionName },
                    { "key": "nameOfKey", "value": templateName }
                ],
            }, function (err, summary) {
                if (err) {
                    console.log(err)
                }
                resolve(summary)
            });
        })
    }
}


function getEnvironmentFile() {
    const environment = (process.env.ENVIRONMENT).toUpperCase();
    let environmentFile;
    switch (environment) {
        case 'UAT':
            environmentFile = `path/of/postmanenvfile\basedOnEnv`;
            return environmentFile;

        case 'TEST':
            environmentFile = `path/of/postmanenvfile\basedOnEnv`;
            return environmentFile;

        case 'PROD':
            environmentFile = `path/of/postmanenvfile\basedOnEnv`;
            return environmentFile;

        default:
            throw new Error("enter valid ENVIRONMENT in .env file. UAT, TEST and PROD are the only permitted values ");
    }
}

function config(arrFolder, resultsName) {
    const envFile = getEnvironmentFile()
    const runobj = {
        collection: 'APITesting/PostmanCollection/nexthubDataPreparation.collection.json',
        timeout: 0,
        folder: arrFolder,
        environment: envFile,
        iterationData: [{
            "username": "",
            "password": "",
            "username_encoded": ""
        }],
        reporters: ['htmlextra', 'cli'],
        reporter: {
            htmlextra: {
                export: 'postmanResults/' + resultsName + '.html'
            }
        },
        ignoreRedirects: true,
        color: "on"
    }

    return runobj;
}

module.exports = new dataCleanUp();
// export default new dataCleanUp();