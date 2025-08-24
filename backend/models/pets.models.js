const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required.'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'Species is required.'],
        enum: ['Dog', 'Cat', 'Rabbit', 'Parrot', 'Hamster', 'Other']
    },
    breed: {
        type: String,
        required: [true, 'Breed is required.'],
        trim: true
    },
    color: {
        type: String,
        required: [true, 'Color is required.'],
        trim: true
    },
    weight: {
        type: Number,
        min: [0, 'Weight cannot be negative.']
    },
    photo: {
        type: String,
        required: [true, 'A photo of your pet is required.']
    },
    nature: {
        type: String,
        trim: true,
        enum: ['Playful', 'Calm', 'Shy', 'Energetic', 'Affectionate']
    },
    gender: {
        type: String,
        trim: true,
        required: true,
        enum: ['Male', 'Female']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'Description cannot be more than 500 characters.']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Pet", petSchema)