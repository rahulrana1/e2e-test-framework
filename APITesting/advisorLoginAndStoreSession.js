import dataCleanUp from './apiRunner.js'

async function advisorLoginAndStoreSessionCookie() {
    await dataCleanUp.advisorLoginAndStoreCookies()
}

advisorLoginAndStoreSessionCookie()


