const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Full name is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email address.']
    },
    password:{
        type: String,
        required: [true, 'Password is required.'],
        minLength: [6, 'Password must have atleast 6 characters.']
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required.'],
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number.']
    },
    locality: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    },
    profilepic: {
        type: String,
    },
    pets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)