const dataSetup = require('../../APITesting/apiRunner')
const expect = require('chai').expect
let folderCreateTemplateDashboard = ['Create Template Dashboard']
let folderCreateCustomDashboard = ['Create Custom Dashboard']

async function createFinancialXrayDashboard() {
    const createFinancialXrayDashboardSummary = await dataSetup.createTemplateDashboard(folderCreateTemplateDashboard, "AutomationTestGroup", "December Demo (123) Trading Company Limited Auckland", "Financial X-ray")
    await expect(createFinancialXrayDashboardSummary.run.stats.assertions.failed).to.equal(0)
}

async function createCustomDashboard() {
    const createCustomDashboardSummary = await dataSetup.createCustomDashboard(folderCreateCustomDashboard, "AutomationTestGroup", "December Demo (123) Trading Company Limited Auckland", "WidgetLibary_VisualTesting")
    await expect(createCustomDashboardSummary.run.stats.assertions.failed).to.equal(0)
}

async function dataSetupForVisualTests() {
    await createFinancialXrayDashboard()
    await createCustomDashboard()
}

dataSetupForVisualTests()