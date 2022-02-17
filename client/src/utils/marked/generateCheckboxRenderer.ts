
/* RETURN FALSE RETURNS DEFAULT */

const generateCheckboxRenderer = (text: string, htmlTag: {
    opening: string, closing: string,
    default: string
}, additionalClasses: string = 'rendered-paragraph') => {

    const rule = /\[[ |x]\]/g;

    /* Check match */
    if (text.match(rule)) {

        let checkboxIndexes: any = {};

        for (let match of text.matchAll(rule)) {
            if (match && match.index !== undefined) {
                let ticked = text[match.index + 1].toLowerCase() === 'x';

                checkboxIndexes[match.index] = { ticked: ticked };
            }
        }

        let word = '';
        let generatedHtml = '';

        for (let i = 0; i < text.length; i++) {
            if (checkboxIndexes[i]) {

                generatedHtml += word;
                word = '';

                let ticked = checkboxIndexes[i].ticked;

                generatedHtml += `<div class="rendered-checkbox" style="--bg-color: ${ticked ? 'hsl(207, 90%, 64%)'
                    :
                    'white'}; --bg-boxshadow: ${!ticked ? 'inset 0px 0px 3px black' : ''}">${ticked ? '<img src="/tickmark.svg" class="tickmark-svg" />' : ''}</div>`

                i += 2;

            } else {
                word += text[i];
                if (i === text.length - 1) {
                    generatedHtml += word;
                }
            }
        }


        if (additionalClasses) {

            generatedHtml = `<div class="${additionalClasses} ">` + generatedHtml + '</div>';

        } else {
            generatedHtml = `<p class="rendered-paragraph">` + generatedHtml + '</p>';
        }

        return generatedHtml;

    } else {

        return htmlTag.default + text + htmlTag.closing;
    }


}



export default generateCheckboxRenderer;