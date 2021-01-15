const selectEnv = require('../../utils/environmentToTest')
const appUrl = selectEnv.envToTest;

module.exports = async (page, scenario, vp) => {
    await page.setDefaultNavigationTimeout(25000);
    await page.setDefaultTimeout(25000);
    await page.goto(appUrl);
    await page.waitForSelector('input[name="userEmailId"]', {
        visible: true,
    });

    await page.type('input[name="userEmailId"]', 'emailId@test.com');
    await page.click('#submitbutton')
    await page.waitForSelector('input[name="userPassword"]', {
        visible: true,
    });
    await page.type('input[name="userPassword"]', 'Password@1');
    await page.click('#submitbutton')
    await page.waitForSelector('#search', {
        visible: true,
    });
    await page.waitFor('*')
    await page.waitFor(5000)
};
