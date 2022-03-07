const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    bookmarkedImages: [{
        imageURL: {
            type: String,
            required: [true, 'Image URL is necessary'],
        },
        savedDate: {
            type: Date,
            default: new Date(),
        },
    }],
},
{
    timestamps: true   
})

module.exports = mongoose.model('User', userSchema)