import { Renderer } from "marked";
import generateCheckboxRenderer from "./generateCheckboxRenderer";

type CustomRendererType = {
    heading: Function;
    link: Function;
    paragraph: Function;
}

const customRenderer: Renderer & any & CustomRendererType = {
    heading(text: string, level: number) {

        return generateCheckboxRenderer(text, {
            openingTag: `<h${level} class="rendered-heading rendered-heading-${level} rendered-checkbox-text">`,
            closingTag: `</h${level}>`,
            defaultTag: `<h${level} class="rendered-heading rendered-heading-${level}">`
        })

    },

    link(href: string, title: string, text: string) {

        return `<span class="rendered-link-wrapper"><a class="rendered-link" href=${href}>${text}</a>${title ? `<span class="rendered-link-tooltip">${title}</span>` : ''}</span>`
    },
    paragraph(text: string) {

        return generateCheckboxRenderer(text, {
            openingTag: '<p class="rendered-checkbox-text">',
            closingTag: '</p>',

            defaultTag: '<p class="rendered-paragraph">'
        })

    }

}

export default customRenderer;