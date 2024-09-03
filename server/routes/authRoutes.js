const express = require("express");
const router = express.Router();
const { signUp, signIn, verifyToken } = require("../controllers/authController"); // Adjust the path to your controller

// Route for user sign-up
router.post("/signup", signUp);

// Route for user sign-in
router.post("/signin", signIn);

// Route for verifying JWT token
router.post("/verifyToken", verifyToken);

module.exports = router;
