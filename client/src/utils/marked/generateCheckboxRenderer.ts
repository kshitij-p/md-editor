const generateCheckboxRenderer = (text: string, outPutTag: { openingTag: string, closingTag: string }) => {
    /* Check match */
    const rule = /\[[ |x]\]/g;

    if (text.match(rule)) {

        let checkboxIndexes: any = {};

        for (let match of text.matchAll(rule)) {
            if (match && match.index !== undefined) {
                let ticked = text[match.index + 1].toLowerCase() === 'x';

                checkboxIndexes[match.index] = { ticked: ticked };
            }
        }

        let generatedHtml = '';
        let word = '';

        for (let i = 0; i < text.length; i++) {
            if (checkboxIndexes[i]) {
                generatedHtml += generatedHtml += outPutTag.openingTag + word + outPutTag.closingTag;;
                word = '';

                let ticked = checkboxIndexes[i].ticked;

                generatedHtml += `<div class="rendered-checkbox" style="--bg-color: ${ticked
                    ? 'hsl(207, 90%, 64%)'
                    :
                    'white'};--bg-border: ${!ticked ? '2px solid black' : ''} ">${ticked ? '<img src="/tickmark.svg" class="tickmark-svg" />' : ''}</div>`;

                i += 2;

            } else {
                if (i === text.length - 1) {
                    generatedHtml += outPutTag.openingTag + word + outPutTag.closingTag;
                    word = '';
                } else {
                    word += text[i];
                }
            };
            console.log({ word });
        }

        console.log({ generatedHtml });

        return generatedHtml; // parseInline to turn child tokens into HTML

    }

    return outPutTag.openingTag + text + outPutTag.closingTag;

}

export default generateCheckboxRenderer;