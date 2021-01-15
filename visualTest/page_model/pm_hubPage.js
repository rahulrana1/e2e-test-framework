class hubPage {

    constructor(page) {
        this.page = page;
        this.searchbox = '#search'
        this.automationTestGroupTile = 'a[title="AutomationTestGroup"]'
    }

    async waitForSearchbox() {
        await this.page.waitForSelector(this.searchbox, {
            visible: true,
        });
    }

    async waitForAutomationtTestGroupTile() {
        await this.page.waitForSelector(this.automationTestGroupTile, {
            visible: true,
        });
    }

    async searchClientGroup(name) {
        await this.page.type(this.searchbox, name);
    }
}

module.exports = hubPage;