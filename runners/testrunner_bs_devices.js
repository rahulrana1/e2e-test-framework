import {startTests , createTestCafeInstance} from '../utils/runner'
require('dotenv/config');
const SUPPORTED_BROWSERS = [
  [
    "browserstack:Samsung Galaxy S10@9.0",
    "browserstack:iPhone X@11.0"
  ]
];

const concurreny = 1
const browserMetaData = ''
const deviceMetaData = 'all'
const reporter = [{
  "name" :'spec'
},
{ 
 "name": 'junit', 
 "output": "./reports/devices.xml" 
}]
startTests(SUPPORTED_BROWSERS, createTestCafeInstance, concurreny, browserMetaData, deviceMetaData, reporter)