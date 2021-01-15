import { Selector, t, RequestLogger } from 'testcafe';
import requestLoggerUtilities from '../../utils/_requestLoggerUtilities.js'
import { validateElementExistsAndClick } from '../../helpers/helper.js'
const requestLoggerUtils = new requestLoggerUtilities()

class dashboard {
    constructor () {

        //add page objects
    }

    async sampleFunctionForXHR(valuesInUploadedBudgetFile){

        const loggerComponents = RequestLogger(/\path\/api/, {
            logRequestHeaders: true,
            logRequestBody: true,
            logResponseHeaders: true,
            logResponseBody: true,
            stringifyResponseBody: false
        });

        await t
            .addRequestHooks(loggerComponents)
            .wait(20000)
        await requestLoggerUtils.unzipLoggerResponses(t, {requestLogger: loggerComponents, toJson: true});
        await t
            .expect(loggerComponents.requests[0].response.statusCode).eql(200)
            const jsonResponse = loggerComponents.requests[0].response.body[0].values
            var total = 0
        await  Object.keys(jsonResponse).forEach(function(key){
                //console.log(key,jsonResponse[key])
                    if(parseInt(jsonResponse[key])) {
                        //console.log(key,jsonResponse[key])
                        total = total + parseInt(jsonResponse[key])
                    }
                })
        await t.expect(total).eql(12 * valuesInUploadedBudgetFile)
    }
}

export default new dashboard();