const newman = require('newman');
const expect = require('expect.js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const environment = process.env.ENVIRONMENT.toLowerCase()

describe('As a user, I want to test my application', function () {
    const collection = 'path/for/collection.json';
    const environmentVarFile = `path/for/postman_envfile`;

    it('Running my application tests', function (done) {
        this.timeout(600000);
        newman.run({
            collection: collection,
            timeout: 0,
            environment: environmentVarFile,
            reporters: ['htmlextra', 'cli', 'json', 'junit'],
            reporter: {
                htmlextra: {
                    export: 'APITesting/reports/APINAME/html/fileName.html'
                },
                junit: {
                    export: 'APITesting/reports/APINAME/junit/fileName.xml'
                },
                json: {
                    export: 'APITesting/reports/APINAME/json/fileName.json'
                }
            },
            ignoreRedirects: true,
            color: true,
            folder: ['name','of','folders','to','run']
        }, function (err, summary) {
            var assertionFailures = summary.run.stats.assertions.failed;
            expect(assertionFailures).to.be(0);
            console.log("Test executed");
            done();
        });
    });
});