import { Renderer } from "marked";
import generateCheckboxRenderer from "./generateCheckboxRenderer";


const customRenderer: any & Renderer = {
    heading(text: string, level: number) {

        return generateCheckboxRenderer(text, {
            openingTag: `<h${level} class="rendered-heading rendered-heading-${level}">`,
            closingTag: `</h${level}>`
        })

    },
    
    link(href: string, title: string, text: string) {

        return `<a class="rendered-link" herf=${href} data-title="${title}" >${text}</a>`
    },
    paragraph(text: string) {

        /* Check for match */
        
        return generateCheckboxRenderer(text, {
            openingTag: '<b class="rendered-checkbox-text">',
            closingTag: '</b>'
        })
       
    }

}

export default customRenderer;