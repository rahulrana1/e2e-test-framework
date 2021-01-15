# acuit-testcafe
This is the automation framework to run the UI tests for CFC and NextHub

## Tools used to develop the framework:
1. TestCafe
2. BrowserStack
3. Slack
4. Jenkins

## Important point to consider:
- The framework provides the capability to run tests across devices and browsers
-	Use the concurrent sessions to reduce the test execution time

## Branching
The default branch is develop, so branch off that with a branch for your feature etc, and raise a Pull Request on GitHub back into develop.

## Steps to run the tests from Continuous Integration and local:
1. npm install
2. For local : node testrunner_local.js
3. For jenkins/Codeship : node testrunner_browserStack.js

## Next steps:
- Add more test scenarios for testing, identify the candidates to be automated
- Develop data reconcilation tests
- Develop Mobile device tests


## Best practises:
-	Use page object model
- create the reusable functions(page actions) in the page object file
- Develop the data validation checks using the requestlogger
- Do the dry run of the suite before merging the PR
