import { Renderer } from "marked";
import generateCheckboxRenderer from "./generateCheckboxRenderer";

type CustomRendererType = {
    heading: Function;
    link: Function;
    paragraph: Function;
}

const customRenderer: Renderer & any & CustomRendererType = {
    heading(text: string, level: number) {

        return generateCheckboxRenderer(text,
            {
                opening: `<h${level}>`, closing: `</h${level}>`,
                default: `<h${level} class='rendered-heading rendered-heading-${level}'>`
            },
            `rendered-heading rendered-heading-${level}`);

    },

    link(href: string, title: string, text: string) {

        return `<span class="rendered-link-wrapper"><a class="rendered-link" aria-label="${title}" href=${href}>${text}</a>${title ? `<span class="rendered-link-tooltip"><b>${title}</b></span>` : ''}</span>`

    },
    paragraph(text: string) {

        return generateCheckboxRenderer(text,
            {
                opening: '<p>',
                closing: '</p>',
                default: `<p class='rendered-paragraph'>`
            }
            , 'rendered-paragraph');

    },
    listitem(text: string, checked: boolean, task: boolean) {

        let ticked = text.includes('<input checked="" disabled="" type="checkbox">');

        let rendered = '<li>' + text.replaceAll(`${ticked ? '<input checked="" disabled="" type="checkbox">' : '<input disabled="" type="checkbox">'}`, `<div class="rendered-checkbox" style="--bg-color: ${ticked ? 'hsl(207, 90%, 64%)'
            :
            'white'}; --bg-boxshadow: ${!ticked ? 'inset 0px 0px 3px black' : ''}">${ticked ? '<img src="/tickmark.svg" class="tickmark-svg" />' : ''}</div>`) + '</li>'



        return rendered
    }


}

export default customRenderer;