import {startTests, createTestCafeInstance} from '../utils/runner'
require('dotenv/config');
const SUPPORTED_BROWSERS = [
  [
    "browserstack:chrome:Windows 10"
  ]
/*,
  [
    "browserstack:chrome:Windows 10",
    "browserstack:firefox:OS X High Sierra"
  ]*/
];

const concurreny = 10
const browserMetaData = 'chrome'
const deviceMetaData = ''
const reporter = [{
  "name" :'spec'
},
{
 "name": 'junit',
 "output": "./reports/chrome.xml"
}]
startTests(SUPPORTED_BROWSERS, createTestCafeInstance, concurreny, browserMetaData, deviceMetaData, reporter)