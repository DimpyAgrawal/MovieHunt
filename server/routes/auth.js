const express = require('express');
const app = express();
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    console.log('inside register');
    const { name, email, password,pic } = req.body;
    console.log( "image url " + pic);
    
    console.log(name + " " + email + " " + password);
    if (!name || !email || !password) {
        return res.send({ error: "Fill Complete details" });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        console.log(name + " " + email + " " + password);

        const oldUser = await User.findOne({ email });

        
        if (oldUser) {
            return res.json({ error: "User Exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, 
            pic,
        });

        return res.json({ data: "Registered Successfully!" });
    } catch (error) {
        return res.status(500).json({ data: "Error occurred while registering user", error });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const exist = await User.findOne({ email });
        if (!exist) {
            console.log("User does not exist");
            return res.status(400).send("User does not exist");
        }

        const match = await bcrypt.compare(password, exist.password);
        if (!match) {
            console.log("Password does not match");
            return res.status(400).send("Password does not match"); 
        }

        const token = jwt.sign({ email: exist.email, name: exist.name, pic: exist.pic ,id:exist._id}, process.env.JWT_SECRET);
        console.log("Login successful");
        return res.send({
            msg: "Login Successfully",
            data: token
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: "error",
            msg: "An error occurred while login" 
        });
    }
});




module.exports = router;