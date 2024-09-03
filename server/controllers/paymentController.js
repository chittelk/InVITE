const { sendTicket } = require("./smsController");
const express = require("express");
const app = express();
const User = require("../models/user");
const { Event } = require("../models/event");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
dotenv.config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());  // Ensure this middleware is added

const stripe = require("stripe")(process.env.STRIPE_KEY);
const uuid = require("uuid").v4;

const payment = async (req, res) => {
    let charge, status, check;
    const { product, token, user, event } = req.body;

    const key = uuid();

    try {
        // Create Stripe customer
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });
        // console.log(customer)

        // Create a charge
        charge = await stripe.charges.create(
            {
                amount: product.price * 100,
                currency: "INR",
                customer: customer.id,
                receipt_email: token.email,
                description: `Booked Ticket for ${product.name}`,
                shipping: {
                    name: token.billing_name,
                    address: {
                        line1: token.shipping_address_line1,
                        line2: token.shipping_address_line2,
                        city: token.shipping_address_city,
                        country: token.shipping_address_country,
                        postal_code: token.shipping_address_zip,
                    },
                },
            },
            {
                idempotencyKey: key,
            }
        );

        // console.log("Charge: ", { charge });
        status = "success";

        // Collect ticket details
        // console.log("User Object:", user);  // Log the user object
        const decoded = jwt.verify(user.user_id, JWT_SECRET);
        const user_data_new = await User.findOne({ email: decoded.email });

        const userDocs = await User.find({ _id: user_data_new._id }).exec();  // Use _id to query
        // console.log("User Docs:", userDocs);  // Log the result of user lookup

        if (userDocs.length === 0) {
            console.log("User is unauthorized")
            res.status(401).send({ msg: "User is unauthorized" });
            return;
        }

        const userDetails = userDocs[0];
        const Details = {
            email: userDetails.email,
            event_name: product.name,
            name: token.billing_name,
            pass: key,
            price: product.price,
            address1: token.shipping_address_line1,
            city: token.shipping_address_city,
            zip: token.shipping_address_zip,
        };

        // console.log("All details before email: ", Details);

        const eventDoc = await Event.findOne({
            event_id: event.event_id,
            "participants.id": user_data_new._id,  // Use _id for participant check
        }).exec();

        if (eventDoc) {
            console.log("Element already exists in array");
            check = "alreadyregistered";
        } else {
            console.log("User ID:", user_data_new._id);

            await Event.updateOne(
                { event_id: event.event_id },
                {
                    $push: {
                        participants: {
                            id: user._id,
                            name: userDetails.name,  // Use name instead of username
                            email: userDetails.email,
                            passID: key,
                            regno: userDetails._id,  // Assuming regno should be user _id
                            entry: false,
                        },
                    },
                }
            );
        }

        // if (check !== "alreadyregistered") {
        //     sendTicket(Details);
        // }

        // Update user registered events
        const events = await Event.find({ event_id: event.event_id }).exec();
        if (events.length !== 0) {
            await User.updateOne(
                { _id: user_data_new._id },  // Use _id for update
                { $push: { registeredEvents: events[0] } }
            );
        }

        res.send({ status });

    } catch (error) {
        console.error("Payment Error: ", error);
        if (!res.headersSent) {
            res.status(500).send({ status: "error", msg: "An error occurred during payment." });
        }
    }
};

module.exports = {
    payment,
};
