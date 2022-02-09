export type MDFile = {
    _id: string;
    path: string;
    name: string;
    lastModified: Date;
    author: string;
}

export type EditorPreferenceColor = {
    name: string;
    color: string;
}

export type EditorColorTheme = Object & {
    name: string;
    colors: EditorPreferenceColor[];
}

export type EditorPreferencesType = Object & {
    themes: EditorColorTheme[];
    selectedTheme: number;
}