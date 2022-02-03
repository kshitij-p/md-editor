const generateCheckboxRenderer = (text: string, outputTag: 
    { openingTag: string, closingTag: string, defaultTag: string }
    ,) => {
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
                generatedHtml += outputTag.openingTag + word + outputTag.closingTag;
                word = '';

                let ticked = checkboxIndexes[i].ticked;

                generatedHtml += `<div class="rendered-checkbox" style="--bg-color: ${ticked
                    ? 'hsl(207, 90%, 64%)'
                    :
                    'white'};--bg-border: ${!ticked ? '2px solid black' : ''} ">${ticked ? '<img src="/tickmark.svg" class="tickmark-svg" />' : ''}</div>`;

                i += 2;
                
            } else {
                if (i === text.length - 1) {
                    generatedHtml += outputTag.openingTag + word + outputTag.closingTag;
                    word = '';
                } else {
                    word += text[i];
                }
            };
        }

        return generatedHtml; 

    } else {

        return `${outputTag.defaultTag}${text}${outputTag.closingTag}`
    }
    

}

export default generateCheckboxRenderer;