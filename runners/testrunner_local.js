require('dotenv/config')
const createTestCafe = require('testcafe')
let testcafe = null
let runner = null
const reporters = [{
		name: 'spec',
	},
	{
		name: 'junit',
		output: './reports/chrome.xml',
	},
]

createTestCafe('localhost', 1337, 1338)
	.then(tc => {
		testcafe = tc
		//runner = testcafe.createRunner()
		runner = testcafe.createLiveModeRunner()

		return (
			runner
			// list multiple test files
			.src('./tests/nexthub/*.spec.js')
			.browsers(['chrome'])
			.reporter(reporters)
			.concurrency(1)
			.run()
		)
	})
	.then(failedCount => {
		console.log('Tests failed: ' + failedCount)
		testcafe.close()
	})