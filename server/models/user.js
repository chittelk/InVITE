const mongoose = require("mongoose");
const { eventSchema } = require("./event");

const userSchema = new mongoose.Schema(
    {
        user_token: {
            type: String,
            required: true,
            unique: true,
        },
        reg_number: {
            type: String,
            trim: true,
            required: false,
        },
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
