"use strict";
const environments = ["TEST", "UAT", "PROD"];
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
//require('dotenv/config')

function selectEnvironment() {
    this.environment = (process.env.ENVIRONMENT).toUpperCase();
    console.log("this.environment", this.environment)
    this.application = (process.env.APPLICATION).toUpperCase();
    this.cfcURLs = {
        "TEST": "https://test.url/signin",
        "UAT": "https://uat.url/signin",
        "PROD": "https://url/signin"
    };
    this.nexthubURLs = {
        "TEST": "https://test.urlcom",
        "UAT": "https://uat.url.com",
        "PROD": "https://url.com"
    };

    if (!environments.includes(this.environment)) {
        throw new Error("Please provide either of three values(PROD,UAT,TEST) in the .env file");
    }

    this.envToTest = this.application === "CFC" ? this.cfcURLs[this.environment] : this.nexthubURLs[this.environment];
    console.log("this.envToTest", this.envToTest)
    return this.envToTest;
}
module.exports = new selectEnvironment();