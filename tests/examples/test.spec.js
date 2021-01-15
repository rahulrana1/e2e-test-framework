import dataCleanUp from '../../APITesting/apiRunner'

/*This is just a guide on how to use after and before hooks for :
    1. deleting a dashboard using client group name and dashboard name
    2. inviting a user to client group
    3. Deleting a user from client group
*/

fixture (`Examples : Create and delete dashboard && invite and delete user using PostMan collections`)

    test
        .meta({ sequence: '1' })
        .after(async t => {
            let folder = ['Delete Specific Dashboard With DashboardName']
            const testSummary = await dataCleanUp.deleteDashboardWithName(folder, "AutomationTestGroup", "fromNewman")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })


        ('example : delete dashboards', async t => {
            /***** your code */
        });

    test
        .meta({ sequence: '1' })
        .before(async t => {
            let folderInviteUser = ['Invite user to clientGroup']
            const testSummary = await dataCleanUp.inviteUserToClientGroup(folderInviteUser, "AutomationTestGroup", "testedge@mailinator.com")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })
        .after(async t => {
            let folderDeleteUser = ['Delete user from ClientGroup']
            const testSummary = await dataCleanUp.deleteUserFromClientGroup(folderDeleteUser, "AutomationTestGroup", "testedge@mailinator.com")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })


        ('example : invite and delete user', async t => {
            /***** your code */
        });

    test
        .meta({ sequence: '1' })
        .before(async t => {
            let folder = ['Create Custom Dashboard']
            const testSummary = await dataCleanUp.createCustomDashboard(folder, "AutomationTestGroup", "December Demo (123) Trading Company Limited Auckland", "fromNewman")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })

        ('example : Creates custom dashboard', async t => {
            /***** your code */
        });

    test
        .meta({ sequence: '1' })
        .before(async t => {
            let folder = ['Create Template Dashboard']
            const testSummary = await dataCleanUp.createTemplateDashboard(folder, "AutomationTestGroup", "December Demo (123) Trading Company Limited Auckland", "Bank Insights")
            await t.expect(testSummary.run.stats.assertions.failed).eql(0)
        })

        ('example : Creates template dashboard', async t => {
            /***** your code */
        });

