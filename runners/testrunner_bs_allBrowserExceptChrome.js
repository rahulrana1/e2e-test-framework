import {startTests , createTestCafeInstance} from '../utils/runner'
require('dotenv/config');
const SUPPORTED_BROWSERS = [
  [
    "browserstack:firefox:Windows 10",
    "browserstack:safari:OS X High Sierra",
    "browserstack:edge:Windows 10"
  ]
];

const concurreny = 2
const browserMetaData = 'all'
const deviceMetaData = ''
const reporter =  [{
"name" :'spec'
},
{
"name": 'junit',
"output": "./reports/allBrowserExceptChrome.xml"
}]
startTests(SUPPORTED_BROWSERS, createTestCafeInstance, concurreny, browserMetaData, deviceMetaData, reporter)