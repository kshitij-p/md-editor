import { EditorColorTheme } from "./types";

export const defaultThemes: EditorColorTheme[] = [
    {
        name: 'Material',
        colors: [
            { name: 'Editor Background', color: '#263238' },
            { name: 'Editor Text', color: '#EEFFFF' },
            { name: 'Gutter Background', color: '#263238' },
            { name: 'Gutter Text', color: '#546E7A' },
            {name: 'Selected Text Color', color: 'rgba(128, 203, 196, 0.2)'}
        ]
    },
    {
        name: 'Dracula',
        colors: [

            { name: 'Editor Background', color: '#44475a' },
            { name: 'Editor Text', color: '#f8f8f2' },
            { name: 'Gutter Background', color: '#282a36' },
            { name: 'Gutter Text', color: '#f8f8f2' },
            {name: 'Selected Text Color', color: 'rgba(128, 203, 196, 0.2)'}
        ]
    },


]

export const defaultCustomTheme: EditorColorTheme = {
    name: 'Custom',
    colors: [

        { name: 'Editor Background', color: '#263238' },
        { name: 'Editor Text', color: '#EEFFFF' },
        { name: 'Gutter Background', color: '#263238' },
        { name: 'Gutter Text', color: '#546E7A' },
        {name: 'Selected Text Color', color: 'rgba(128, 203, 196, 0.2)'}
    ]
}