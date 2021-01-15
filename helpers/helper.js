import { t } from 'testcafe';

    export async function switchIframe(iframe) {
	    await t.switchToIframe(iframe)
    }

    export async function validateElementExistsAndClick(element) {
        await t
            .expect(element.exists).ok()
            .click(element)
    }
	
    export async function dropdownSelectAndOption(selectedDropdown, optionList, optionValue) {
        await t
            .expect(selectedDropdown.visible).ok()
            .click(selectedDropdown)
            .click(optionList.withText(optionValue))
    }