const defaultUserPrefs = {
    themes: {
        customTheme: {
            name: 'Custom',
            colors: [

                { name: 'Editor Background', color: '#263238' },
                { name: 'Editor Text', color: '#EEFFFF' },
                { name: 'Gutter Background', color: '#263238' },
                { name: 'Gutter Text', color: '#546E7A' },
                { name: 'Selected Text Color', color: 'rgba(128, 203, 196, 0.2)' }
            ]
        },

        selectedTheme: 0
    },
    misc: {
        syncScrollingOn: true
    }
}

module.exports = defaultUserPrefs;
