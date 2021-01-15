import {roleNexthubAdvisor} from '../../roles/roles'
import {RequestLogger} from 'testcafe'
import requestLoggerUtilities from '../../utils/_requestLoggerUtilities.js'
import hubPage from '../../page_model/nexthub/hub.page.js'
import dashboardPage from '../../page_model/nexthub/dashboard.page.js'
import myDashboardsPage from '../../page_model/nexthub/myDashboards.page.js'

const requestLoggerUtils = new requestLoggerUtilities()
const loggerTop5CreditorsDebtors = RequestLogger(/\/api\/v1\/gl_data\/contacts\/list/, {
  logRequestHeaders: true,
  logRequestBody: true,
  logResponseHeaders: true,
  logResponseBody: true,
  stringifyResponseBody: false
});

const loggerOverDueBillsAndInvoices = RequestLogger(/\/api\/v1\/gl_data\/invoices\/list/, {
  logRequestHeaders: true,
  logRequestBody: true,
  logResponseHeaders: true,
  logResponseBody: true,
  stringifyResponseBody: false
});

fixture `XHR validation`
  test.skip
    .meta({ sequence: '1'})
    ('XHR validation example', async t => {
      await t.addRequestHooks(loggerTop5CreditorsDebtors)
      await t.addRequestHooks(loggerOverDueBillsAndInvoices)
      await t.eval(() => location.reload(true));
      await dashboardPage.top5CreditorLabel.exists
      await requestLoggerUtils.unzipLoggerResponses(t, {requestLogger: loggerTop5CreditorsDebtors, toJson: true});
      await requestLoggerUtils.unzipLoggerResponses(t, {requestLogger: loggerOverDueBillsAndInvoices, toJson: true});

      //validation for top 5 creditors
      await t.expect(loggerTop5CreditorsDebtors.requests[0].response.statusCode).eql(200)
      //await console.log("loggerTop5CreditorsDebtors.requests[0].response.body",loggerTop5CreditorsDebtors.requests[0].response.body)
      await t.expect([loggerTop5CreditorsDebtors.requests[0].response.body[0].name,
                      loggerTop5CreditorsDebtors.requests[0].response.body[1].name,
                      loggerTop5CreditorsDebtors.requests[0].response.body[2].name,
                      loggerTop5CreditorsDebtors.requests[0].response.body[3].name,
                      loggerTop5CreditorsDebtors.requests[0].response.body[4].name],
                      "Validates the XHR values"
                    ).eql(['Direct Labour','Purchases','Leased Machinery','Freight & Courier','Interest Expense'])
    });