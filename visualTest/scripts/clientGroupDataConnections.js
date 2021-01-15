const mocks = require('../mocks/mock')

const ClientGroupDataConnections = require('../mocks/mock.organizations.json')
const OrgStatus = require('../mocks/mock.orgStatus.json')
const OrgGroupNotifications = require('../mocks/mock.orgGroupNotifications.json')
const HubPage = require('../page_model/pm_hubPage');
const ManageClientGroupPage = require('../page_model/pm_manageClientGroupPage');
const selectEnv = require('../../utils/environmentToTest')
const appUrl = selectEnv.envToTest;

module.exports = async (page, scenario, vp) => {
    const hubPage = new HubPage(page);
    const manageClientGroupPage = new ManageClientGroupPage(page);
    await page.setDefaultNavigationTimeout(25000);
    await page.setDefaultTimeout(25000);
    await page.goto(appUrl);
    await hubPage.waitForSearchbox();
    await hubPage.searchClientGroup('AutomationTestGroup');
    await hubPage.waitForAutomationtTestGroupTile();
    await hubPage.openManageClientGroupPage();
    const correctClientGroupId = await manageClientGroupPage.getClientGroupId()
    const OrgGroupNotifications_updated = await manageClientGroupPage.updateJson_OrgGroupNotifications(OrgGroupNotifications, correctClientGroupId)
    await mocks.mockMultipleRequests(page, ['/v1/organization_group_notifications', '/organizations', '/v1/statuses'], [OrgGroupNotifications_updated, ClientGroupDataConnections, OrgStatus ])
    await page.waitFor('*');
    await manageClientGroupPage.clickDataConnectionsButton();
    await page.waitFor('*');
    await page.waitFor(15000);
};