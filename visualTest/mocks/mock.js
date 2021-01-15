
async function mockRequests(page, urlPattern, responseJSON) {
    await page.setRequestInterception(true);
    const responseMetadata = {
        content: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
    };
    await page.on('request', request => {
        if (request.url().includes(urlPattern) && request.method() !== "OPTIONS") {
            request.respond({
                ...responseMetadata,
                body: JSON.stringify(responseJSON),
            });
        }
        else {
            request.continue();
        }
    });
};

async function mockMultipleRequests(page, arrUrlPattern, arrResponseJSON) {
    await page.setRequestInterception(true);
    const responseMetadata = {
        content: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
    };

    await page.on('request', request => {
        for (let i = 0; i < arrUrlPattern.length; i++) {
            if (request.url().includes(arrUrlPattern[i]) && request.method() !== "OPTIONS") {
                request.respond({
                    ...responseMetadata,
                    body: JSON.stringify(arrResponseJSON[i]),
                });
            }

            if (i === arrUrlPattern.length-1) {
                request.continue();
            }
        }
    });
};


module.exports = {
    mockRequests,
    mockMultipleRequests
};