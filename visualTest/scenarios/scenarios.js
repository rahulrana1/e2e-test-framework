const selectEnv = require('../../utils/environmentToTest')
const appUrl = selectEnv.envToTest;

module.exports = {

    "scenarios": [
        {
            "label": "HubPage",
            "cookiePath": "",
            "url": appUrl,
            "referenceUrl": "",
            "readyEvent": "",
            "readySelector": "",
            "delay": 1000,
            "hideSelectors": ['#ProfileContainer'],
            "removeSelectors": [],
            "onReadyScript": "../scripts/hubpage.js",
            "hoverSelector": "",
            "clickSelector": "",
            "postInteractionWait": 0,
            "selectors": [],
            "selectorExpansion": true,
            "expect": 0,
            "misMatchThreshold": 0.0,
            "requireSameDimensions": true
        },
        {
            "label": "manageClientGroupPage_DetailsTab",
            "cookiePath": "",
            "url": appUrl,
            "referenceUrl": "",
            "readyEvent": "",
            "readySelector": "",
            "delay": 1000,
            "hideSelectors": ['#ProfileContainer'],
            "removeSelectors": [],
            "onReadyScript": "../scripts/clientGroupDetails.js",
            "hoverSelector": "",
            "clickSelector": "",
            "postInteractionWait": 0,
            "selectors": [],
            "selectorExpansion": true,
            "expect": 0,
            "misMatchThreshold": 0.0,
            "requireSameDimensions": true,
            "viewports": [{
                "label": "tablet",
                "width": 1024,
                "height": 768
            },
            {
                "label": "desktop",
                "width": 1280,
                "height": 1024
            }]
        }
    ],
};