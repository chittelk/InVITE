const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const cookieParser = require("cookie-parser");

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

// Other middlewares and routes...


const signUp = async (req, res) => {
    const { email, contactNumber } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        // Create a new user
        const newUser = new User({
            email,
            contactNumber,
            user_token: token,
            password: contactNumber
            // No need to set reg_number here as it will be created after saving the user
            // user_token can be saved if required, but usually not necessary in the user record
        });

        // Save the user
        await newUser.save();

        // After saving, we can get the user's _id to set reg_number if needed
        newUser.reg_number = newUser._id; // Set reg_number to the user's ObjectId
        await newUser.save(); // Save the updated user with reg_number

        // Respond with success and token
        return res.status(200).json({
            msg: "Welcome",
            user_id: token,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "An error occurred. Please try again later." });
    }
};


const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "This Email ID is not registered. Try Signing Up instead!",
            });
        }

        console.log(password)

        // Compare password
        const validPassword = password === user.password;
        if (!validPassword) {
            return res.status(401).json({
                msg: "Invalid password. Please try again!",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            msg: "Sign-In successful!",
            user_id: token,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "An error occurred. Please try again later." });
    }
};

const verifyToken = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (user) {
            return res.status(200).json({
                msg: "Token verified successfully!",
                user_id: token,
                user_data: user,
            });
        } else {
            return res.status(404).json({ msg: "User not found." });
        }
    } catch (e) {
        console.error(e);
        return res.status(401).json({ msg: "Invalid or expired token." });
    }
};

module.exports = {
    signUp,
    signIn,
    verifyToken,
};
