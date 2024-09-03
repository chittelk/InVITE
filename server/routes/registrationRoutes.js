const express = require('express');
const router = express.Router();
const { updateRegistration } = require('../controllers/registrationController');

// API route for updating registration status
router.post('/update-registration', updateRegistration);

module.exports = router;
