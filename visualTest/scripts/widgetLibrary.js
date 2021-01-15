const mocks = require('../mocks/mock')
const HubPage = require('../page_model/pm_hubPage');
const MyDashboardsPage = require('../page_model/pm_myDashboardsPage');
const widgetLibrary = require('../mocks/mock.widgetLibrary.json')
const selectEnv = require('../../utils/environmentToTest')
const appUrl = selectEnv.envToTest;

module.exports = async (page, scenario, vp) => {
    const hubPage = new HubPage(page);
    const myDashboardPage = new MyDashboardsPage(page)
    await page.setDefaultNavigationTimeout(25000);
    await page.setDefaultTimeout(25000);
    await page.goto(appUrl);
    await hubPage.waitForSearchbox();
    await hubPage.searchClientGroup('AutomationTestGroup');
    await hubPage.waitForAutomationtTestGroupTile();
    await hubPage.openAutomationTestGroup()
    await myDashboardPage.openDashboard('WidgetLibary_VisualTesting') 
    await page.waitFor('*');
    await mocks.mockRequests(page, '/v1/widget_library', widgetLibrary);
    await myDashboardPage.waitForCommentsSelectorToBeAvailable();
    await page.waitFor(5000);
    await myDashboardPage.clickAddWidgetButton();
    await page.waitFor('*');
    await page.waitFor(8000);
};