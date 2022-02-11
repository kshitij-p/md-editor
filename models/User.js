const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    files: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MDFile' }]

    },
    preferences: {
        type: Object,
        default: {
            themes: {
                customTheme: {
                    name: 'Custom',
                    colors: [

                        { name: 'Editor Background', color: '#263238' },
                        { name: 'Editor Text', color: '#EEFFFF' },
                        { name: 'Gutter Background', color: '#263238' },
                        { name: 'Gutter Text', color: '#546E7A' },

                    ]
                },

                selectedTheme: 0
            },
            misc: {
                syncScrollingOn: true
            }



        }
    }

})

const User = new mongoose.model('User', userSchema);

module.exports = User;