import {
    Selector,
    t,
    Role
} from 'testcafe'
import hubPage from '../page_model/nexthub/hub.page.js'
import myDashboardsPage from '../page_model/nexthub/myDashboards.page.js'
import selectEnv from '../utils/environmentToTest'
let appUrl = selectEnv.envToTest;

/*NextHub roles
 ***This role is for login*/
export const sampleLogin = Role(appUrl, async t => {
    await login('userId@test.com', 'Password@1')
}, {
    preserveUrl: true
});

async function login(userName, password) {
    await t
        .expect(Selector('input').withAttribute('name', 'userEmailId').exists).ok()
        .typeText(Selector('input').withAttribute('name', 'userEmailId'), userName)
        .click(Selector('#submitbutton'))
        .expect(Selector('input').withAttribute('name', 'userPassword').exists).ok()
        .typeText(Selector('input').withAttribute('name', 'userPassword'), password)
        .click(Selector('#submitbutton'))
        .expect(hubPage.seachClientGroup.exists).ok()
};
