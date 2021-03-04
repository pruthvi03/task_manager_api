const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');
const multer  = require('multer');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    // user.save()
    //     .then(() => { res.status(201).send(user); })
    //     .catch(err => res.status(400).send(err));
    try {
        await user.save();
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(500).send({error:error.message});
    }

});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(500).send({ error: error });
    }
});
router.post('/users/logout', auth, async (req, res) => {
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
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send({ message: "logged out from all sessions"});
    } catch (error) {
        res.send({ error: error });
    }
})

// router.get('/users', auth ,async (req, res) => {
//     // User.find({})
//     // .then(users=>{ res.send(users)})
//     // .catch(err=> res.status(500).send(err));
//     try {
//         let users = await User.find({})
//         res.status(200).send(users);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
});

router.get('/users/:name', async (req, res) => {
    // User.findOne({name: req.params.name})
    // .then(users=>{ res.send(users)})
    // .catch(err=> res.status(500).send(err));
    try {
        const users = await User.findOne({ name: req.params.name });
        console.log(users)
        if (!users) { res.status(404).send(err) }
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/delete/:user', (req, res) => {
    User.deleteMany({ name: req.params.user }).then(users => { res.redirect('/users') }).catch(err => res.status(500).send(err))
});

router.patch("/users/me",auth, async (req, res) => {
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

});
router.delete("/users/me",auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelEmail(req.user.email,req.user.name)
        res.send(req.user);

    } catch (error) {
        res.status(500).send(error);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        // cb(new Error('File must be a PDF'));
        // cb(undefined,true);
        // cb(undefined,false);
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Please upload a image'));
        }
        cb(undefined,true);
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req, res)=>{
    try {
        const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.status(200).send({message:"file recieved"});
    } catch (error) {
        req.status(500).send({error:error.message});
    }
},(err,req,res,next)=>{res.status(400).send({error:err.message})
});

router.delete('/users/me/avatar',auth, async(req, res)=>{
    req.user.avatar = undefined;
    try {
        await req.user.save();
        res.status(200).send(req.user);
        
    } catch (error) {
        res.status(500).send({error:error.message});
    }
});

router.get('/users/:name/avatar', async(req, res)=>{
    try {
        const user = await User.findOne({name:req.params.name });
        if (!user || !user.avatar ){
            throw new Error('User or avatar not found')
        }
        res.set('Content-Type', 'image/jpg');  
        res.send(user.avatar);  
    } catch (error) {
        res.status(404).send({error:error.message});
    }
})


module.exports = router
