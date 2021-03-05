const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

// create user function
const createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// user login function
const userLogin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(500).send({ error: error });
    }
}

// user logout function
const userLogout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // console.log(token.token, req.token)
            return token.token !== req.token
        });
        await req.user.save();
        res.send({ message: "logged out", token: req.user.tokens });
    } catch (error) {
        res.send({ error: error });
    }
}

// user logout from all device(tokens)
const userLogoutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send({ message: "logged out from all sessions" });
    } catch (error) {
        res.send({ error: error });
    }
}

// user info function
const userInfo = async (req, res) => {
    res.status(200).send(req.user);
}

// Edit user info function
const editUserInfo = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed_updates = ['name', 'email', 'password', 'age'];
    const is_valid_operation = updates.every((update) => allowed_updates.includes(update));
    if (!is_valid_operation) { return res.status(400).send({ error: 'Invalid Updates!!!' }) }

    try {
        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update];
            console.log('updating values')
        });
        await user.save();
        res.send(user)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// Delete user function
const deleteUser = async (req, res) => {
    try {
        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user);

    } catch (error) {
        res.status(500).send(error);
    }
}

// multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // cb(new Error('File must be a PDF'));
        // cb(undefined,true);
        // cb(undefined,false);
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a image'));
        }
        cb(undefined, true);
    }
});

// upload avatar function
const uploadAvatar = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.status(200).send({ message: "file recieved" });
    } catch (error) {
        req.status(500).send({ error: error.message });
    }
}

// delete avatar function
const deleteAvatar = async (req, res) => {
    req.user.avatar = undefined;
    try {
        await req.user.save();
        res.status(200).send(req.user);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// Get avatar function
const getAvatar = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.name });
        if (!user || !user.avatar) {
            throw new Error('User or avatar not found')
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
}



module.exports = {
    createUser,
    userLogin,
    userLogout,
    userLogoutAll,
    userInfo,
    editUserInfo,
    deleteUser,
    upload,
    uploadAvatar,
    deleteAvatar,
    getAvatar
};