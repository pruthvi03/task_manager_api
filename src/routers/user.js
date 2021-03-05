const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const userFunctions = require('../controller/userController');

// create user router
router.post('/users', userFunctions.createUser);

// user login router
router.post('/users/login', userFunctions.userLogin);

// user logout router
router.post('/users/logout', auth, userFunctions.userLogout)

// user logout from all device(tokens)
router.post('/users/logoutAll', auth, userFunctions.userLogoutAll)

// user Info
router.get('/users/me', auth, userFunctions.userInfo);

// Get user avatar
router.get('/users/:name/avatar', userFunctions.getAvatar)

// Edit user Info
router.patch("/users/me", auth, userFunctions.editUserInfo);

// Delete loggedIn user
router.delete("/users/me", auth, userFunctions.deleteUser);

// Delete user avatar
router.delete('/users/me/avatar', auth, userFunctions.deleteAvatar);

// Post user avatar
router.post('/users/me/avatar', auth,
    userFunctions.upload.single('avatar'),
    userFunctions.uploadAvatar,
    (err, req, res, next) => {
        res.status(400).send({
            error: err.message
        }
        )
    });

    
module.exports = router

//                  Other Routes

// router.get('/users/:name', async (req, res) => {
    //     try {
        //         const users = await User.findOne({ name: req.params.name });
        //         console.log(users)
        //         if (!users) { res.status(404).send(err) }
        //         res.send(users);
        //     } catch (error) {
            //         res.status(500).send(error);
//     }
// });

// router.get('/delete/:user', (req, res) => {
//     User.deleteMany({ name: req.params.user }).then(users => { res.redirect('/users') }).catch(err => res.status(500).send(err))
// });