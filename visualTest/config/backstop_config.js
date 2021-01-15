const basicConfig = require('./basic_config');
const scenarios = require('../scenarios/scenarios');
module.exports = {
    ...basicConfig,
    "onBeforeScript": "onBefore.js",
    ...scenarios,
    "paths": {
        "bitmaps_reference": "visualTest/backstop_data/bitmaps_reference",
        "bitmaps_test": "visualTest/backstop_data/bitmaps_test",
        "engine_scripts": "visualTest/scripts",
        "html_report": "visualTest/backstop_data/html_report",
        "ci_report": "visualTest/backstop_data/ci_report",
        "json_report": "visualTest/backstop_data/json_report",
    },
    "report": ["browser", "json"],
    "engine": "puppeteer",
    "engineOptions": {
        "args": ["--no-sandbox"],
        "executablePath": "google-chrome-unstable"
    },
    "asyncCaptureLimit": 5,
    "asyncCompareLimit": 15,
    "debug": true,
    "debugWindow": false
}