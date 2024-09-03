const { Event } = require("../models/event");
const User = require("../models/user");

const updateRegistration = async (req, res) => {
    const { userId, eventId } = req.body;
    
    try {
        const event = await Event.findOne({ event_id: eventId });
        const user = await User.findOne({ user_token: userId });

        if (event && user) {
            event.participants.push({
                id: user._id,
                name: user.username,
                email: user.email,
                regno: user.reg_number,
            });

            await event.save();
            res.status(200).json({ msg: "success" });
        } else {
            res.status(404).json({ msg: "Event or user not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    updateRegistration,
};
