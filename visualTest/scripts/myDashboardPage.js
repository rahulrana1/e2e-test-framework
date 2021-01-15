const HubPage = require('../page_model/pm_hubPage');
const mocks = require('../mocks/mock')
const mock_myDashboardsResponse = require('../mocks/mock.myDashboardPage.json')

module.exports = async (page, scenario, vp) => {
    const homePage = new HubPage(page);
    await page.setDefaultNavigationTimeout(25000);
    await page.setDefaultTimeout(25000);
    await homePage.waitForSearchbox()
    await homePage.searchClientGroup('AutomationTestGroup')
    await homePage.waitForAutomationtTestGroupTile()
    await mocks.mockRequests(page, '/v1/dashboards/organization_group', mock_myDashboardsResponse)
    await homePage.openAutomationTestGroup()
    await page.waitFor('*')
    await page.waitFor(8000)
};