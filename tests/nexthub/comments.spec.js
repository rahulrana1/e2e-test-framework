import {
    roleNexthubClient,
    roleNexthubReadonlyClient, roleNexthubAdvisor,
} from '../../roles/roles'
import hubPage from '../../page_model/nexthub/hub.page.js'
import dashboardPage from '../../page_model/nexthub/dashboard.page.js'
import myDashboardsPage from '../../page_model/nexthub/myDashboards.page.js'
import manageScreenPage from '../../page_model/nexthub/manageScreen.page';
import dataCleanUp from '../../APITesting/apiRunner'

fixture(`Comments validation`)

    test
        .meta({ sequence: '1' })
        .before( async t => {
            let folder = ['Create Custom Dashboard']
            const testSummary = await dataCleanUp.createCustomDashboard(folder, "AutomationTestGroup", "December Demo" +
		   " (123) Trading Company Limited Auckland", "CliComm_2, CliComm_7, CliComm_9")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })
        .after( async t => {
            let deleteDashboardFolder = ['Delete Specific Dashboard With DashboardName']
            const testSummary = await dataCleanUp.deleteDashboardWithName(deleteDashboardFolder, "AutomationTestGroup", "CliComm_2, CliComm_7, CliComm_9")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })

        ('CliComm_2, CliComm_7, CliComm_9: Tag, Post/Edit/Reply/Delete Comment, Mark comment as read', async t => {
            await t.useRole(roleNexthubAdvisor)
            await hubPage.searchAndNavigateToClientGroup('AutomationTestGroup')
            await myDashboardsPage.searchAndNavigateToDashboardPage('CliComm_2, CliComm_7, CliComm_9')
            //CliComm_7: Tag user in comments
            await dashboardPage.tagComment()
            //CliComm_2：Post/Edit/Reply/Delete Comment
            await dashboardPage.addComment('test posting new comments')
            await dashboardPage.addReply('test reply to comments')
            await dashboardPage.editComment('test editing comments')
            await dashboardPage.deleteComment()
            await dashboardPage.addComment('test posting new comments')
            //CliComm_9：Advisor can mark comment as read
            await dashboardPage.markAsRead()
        });