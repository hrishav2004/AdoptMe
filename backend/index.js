require('dotenv').config()
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const session = require('express-session')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require('cors');
const path = require('path')
const fs = require('fs')
const cookieParser = require('cookie-parser');
const upload = require('./config/multerconfig')
const connectDB = require('./config/db')     // require the database connection logic
const secret_key = process.env.JWT_SECRET

// connect to database
connectDB();

// require the data models
const users = require('./models/users.models')
const pets = require('./models/pets.models')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middleware to check if the user is logged in or not
const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({success: false, message: 'No token provided'})
    }
    jwt.verify(token, secret_key, (err, decoded) => {
        if(err){
            return res.status(401).json({success: false, message: 'Invalid token.'})
        }
        req.user = decoded
        next()
    })
}

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await users.findById(req.user.id);
        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed
        } else {
            res.status(403).json({ success: false, message: 'Access Denied: Requires admin privileges.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during admin verification.' });
    }
}

// Get user data, if logged in
app.get('/api/users', verifyToken, async (req, res) => {
    try{
        const user = await users.findById(req.user.id).select('-password')

        if(!user){
            return res.status(404).json({success: false, message: "User not found."})
        }
        return res.json({success: true, user})
    } catch (err) {
        return res.status(500).json({success: false, message: "Server error"})
    }
})

// Get pet listings by particular user, if logged in
app.get('/api/pets/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id
        const user = await users.findById(id)
        const get_pets = user.pets
        return res.status(200).json({success: true, message: "Pets fetched successfully", pets: get_pets})
    } catch (err) {
        return res.status(400).json({success: false, message: "Error fetching pet data."})
    }
})

// Get details of a pet by its id
app.get('/api/petdetails/:pet_id', verifyToken, async (req, res) => {
    const id = req.params.pet_id
    try{
        const details = await pets.findById(id)
        return res.status(200).json({success: true, message: "Pet data fetched successfullty.", details: details})
    }
    catch (err) {
        return res.status(500).json({success: false, message: "Server error."})
    }
})

// Get details of all pets listed
app.get('/api/pets', verifyToken, async (req, res) => {
    try{
        const allPetsWithOwnerDetails = await pets.find().populate('owner', 'fullname contact email locality city state country pincode')
        return res.status(200).json({success: true, message: "Pet details fetched successfully", pets: allPetsWithOwnerDetails})
    }
    catch (err) {
        return res.status(400).json({success: false, message: "Can't fetch pets."})
    }
})

// Get all members of the community
app.get('/api/community', verifyToken, async (req, res) => {
    try{
        const members = await users.find({role: 'user'})
        return res.status(200).json({success: true, message: "Successfully fethced community members", members: members})
    }
    catch (err) {
        return res.status(400).json({success: false, message: "Couldn't fetch community members."})
    }
})

// Register route for user
app.post('/api/register/user', upload.single('profilepic'), async (req, res) => {
    const { fullname, email, contact, password, locality, city, pincode, state, country, role } = req.body
    const curr_user_by_email = await users.findOne({email})
    const curr_user_by_contact = await users.findOne({contact})
    // If profile picture is uploaded
    const profilepic = (req.file ? req.file.filename : '')
    // if there already exists a user with the same email-id
    if(curr_user_by_email || curr_user_by_contact){
        return res.status(400).json({success: false, message: "User with this email or contact number already exists."})
    }
    // hash and store the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const new_user = await users.create({
                fullname,
                email,
                contact,
                password: hash,
                locality,
                city,
                pincode,
                state,
                country,
                role,
                profilepic
            })
            if (new_user){
                const token = jwt.sign({id: new_user._id, email: new_user.email}, secret_key)
                res.cookie('token', token, { httpOnly: true})
                return res.status(201).json({ success: true, message: "Account created successfully!", user: new_user})
            }
            else{
                return res.status(500).json({ success: false, message: "Error creating user."})
            }
        })
    })
})

// Register route for admin
app.post('/api/register/admin', upload.single('profilepic'), async (req, res) => {
    const { fullname, email, contact, password, role, code} = req.body

    if (code !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ success: false, message: "Admin secret code is incorrect." });
    }

    const curr_user_by_email = await users.findOne({email})
    const curr_user_by_contact = await users.findOne({contact})
    const profilepic = (req.file ? req.file.filename : '')
    // if there already exists a user with the same email-id
    if(curr_user_by_email || curr_user_by_contact){
        return res.status(400).json({success: false, message: "User with this email or contact already exists."})
    }
    // hash and store the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const new_user = await users.create({
                fullname: fullname,
                email: email,
                contact: contact, 
                password: hash,
                role: role,
                profilepic
            })
            if (new_user) {
                const token = jwt.sign({id: new_user._id, email: new_user.email}, secret_key)
                res.cookie('token', token, { httpOnly: true })
                return res.status(201).json({success: true, message: "Account created successfully!", user: new_user})
            }
            else{
                return res.status(400).json({success: false, message: "Error creating user."})
            }
        })
    })
})

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        return res.status(400).json({success: false, message: "Both email and password are required."})
    }
    const user = await users.findOne({email})
    if(!user){
        return res.status(404).json({success: false, message: "Invalid email or password."})
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
            const token = jwt.sign({id: user._id, email: user.email}, secret_key)
            res.cookie('token', token, { httpOnly: true })
            return res.status(200).json({success: true, message: "Logged in successfully!", user: user})
        }
        else{
            return res.status(400).json({success: false, message: "Invalid email or password."})
        }
    })
})

// Logout route
app.post('/api/logout', async (req, res) => {
    res.cookie('token', '')
    return res.status(200).json({success: true, message: "Logged out."})
})

// Upload data of the pet for adoption
app.post('/api/uploadpet', upload.single('photo'), async (req, res) => {
    try {
        const { name, species, breed, color, weight, nature, gender, owner, description } = req.body
        const photo = req.file.filename

        // Get the current owner, and a list of all pets he has
        const get_owner = await users.findById(owner)
        if(!get_owner){
            return res.status(400).json({success: false, message: "Couldn't upload pet details."})
        }
        // Create a new pet and store it in pets data model
        const new_pet = await pets.create({
            name: name,
            species: species,
            breed: breed,
            color: color,
            photo: photo,
            weight: weight,
            nature: nature,
            gender: gender,
            description: description,
            owner: owner
        })
        if(!new_pet){
            return res.status(400).json({success: false, message: "Couldn't upload pet details."})
        }
        const get_pets = get_owner.pets
        get_pets.push(new_pet._id)
        // Update to store the pet in its corresponding owner
        await users.findByIdAndUpdate(owner, {
            pets: get_pets
        })
        return res.status(200).json({success: true, message: "Pet details uploaded successfully."})
    }
    catch(err){
        return res.status(500).json({success: false, message: "Server error"})
    }
})

// Update the profile of the user
app.put('/api/update-profile', verifyToken, upload.single('profilepic'), async (req, res) => {
    try{
        const { _id, fullname, email, contact, locality, city, pincode, state, country, photoAction } = req.body
        const profilepic = (req.file ? req.file.filename : '')
        const user = await users.findById(_id)
        const prev_profilepic = user.profilepic

        // Get the path of the profile photo of current user
        const filepath = path.join(__dirname, 'public', 'uploads', prev_profilepic)
        // To check if some user is already having the same credentials
        const existing_user = await users.findOne({
            _id: { $ne: _id },
            $or: [
                {email: email},
                {contact: contact}
            ]
        })

        if(existing_user){
            return res.status(400).json({success: false, message: "There already exists a user with this email or contact."})
        }
        let updatedUser

        if(user.role == 'user'){
            updatedUser = await users.findByIdAndUpdate(_id, {
                fullname: fullname,
                email: email,
                contact: contact,
                locality: locality,
                city: city,
                pincode: pincode,
                state: state,
                country: country,
                profilepic: profilepic
            }, {new: true, runValidators: true}).select('-password');
        }
        else{
            updatedUser = await users.findByIdAndUpdate(_id, {
                fullname: fullname,
                email: email,
                contact: contact,
                profilepic: profilepic
            }, {new: true, runValidators: true}).select('-password');
        }
        fs.unlink(filepath, (err) => {
            if(err){
                console.error("Couldn't remove profile photo", err)
            }
        })
        return res.status(200).json({success: true, message: "Profile updated.", user: updatedUser})
    }
    catch (error) {
        return res.status(400).json({success: false, message: "Couldn't update profile."})
    }
})

// Delete a pet by removing its entry from pets db, and updating pets in users db
app.delete('/api/deletepet/:id', async (req, res) => {
    try{
        const id = req.params.id
        // await pets.findByIdAndDelete(id)
        const pet = await pets.findById(id)
        const owner = await users.findById(pet.owner)
        // remove entry of the pet from the user database
        const pet_list = owner.pets
        const updated_pet_list = pet_list.filter(pet => pet!=id)
        await users.findByIdAndUpdate(owner._id, { pets: updated_pet_list })
        // Find the photo of the pet and its path
        const prev_pet_photo = pet.photo
        const filepath = path.join(__dirname, 'public', 'uploads', prev_pet_photo)
        // remove the pet entry from the database
        await pets.findByIdAndDelete(id)

        // remove the pet's photo from server
        fs.unlink(filepath, (err) => {
            if(err){
                console.error("Couldn't remove pet's photo", err)
            }
        })

        return res.status(200).json({success: true, message: 'Pet entry deleted.', pet: pet, owner: owner, updated_pet_list})
    }
    catch (err) {
        return res.status(400).json({success: false, message: "Couldn't remove pet entry."})
    }
})

// Delete a user by removing their name from users db and removing all corresponding pet entries
app.delete('/api/deleteuser/:id', [verifyToken, verifyAdmin], async (req, res) => {
    try{
        const id = req.params.id
        const user = await users.findById(id)
        const petList = await pets.find({owner: id})
        const petPhotos = petList.map((pet) => {
            return pet.photo
        })
        if(!user){
            return res.status(404).json({success: false, message: "User not found."})
        }
        // Atomically delete all pet listings of this user
        await pets.deleteMany({ owner: id})
        // Remove all pet photos of this user from the server
        petPhotos.map((pet) => {
            const filepath = path.join(__dirname, 'public', 'uploads', pet)
            fs.unlink(filepath, (err) => {
                if(err){
                    console.error("Couldn't remove pet's photo", err)
                }
            })
        })
        // After removing all pet listings, remove the particular user from the database
        await users.findByIdAndDelete(id)
        // Now remove the profile photo of the user
        const profile = user.profilepic
        const filepath = path.join(__dirname, 'public', 'uploads', profile)
        fs.unlink(filepath, (err) => {
            if(err){
                console.log("Couldn't remove profile photo", err)
            }
        })

        return res.status(200).json({success: true, message: "User and all their pet listings have been removed."})
    }
    catch (err) {
        return res.status(500).json({success: false, message: "Server error."})
    }
})

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Connected successfully")
})

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})