import {
    Selector,
    t
} from 'testcafe';

class login {
    constructor() {
        this.emailIDBox = Selector('input').withAttribute('name', 'userEmailId')
        this.passwordBox = Selector('input').withAttribute('name', 'userPassword')
        this.submitButton = Selector('#submitbutton')
    }

    async login(email, password) {
        await t
            .typeText(this.emailIDBox, email)
            .click(this.submitButton)
            .typeText(this.passwordBox, password)
            .click(this.submitButton)
    }
}

export default new login();