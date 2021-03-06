const express = require('express');

const {User} = require('../models/user');

const router = express.Router();
const _ = require('lodash');

const {authencicateUser} = require('../middlewares/authentication');

router.get('/',(req,res) => {
    res.send('hi')
});

//authenticate middleware
//custom middleware,we can call where ever we require


// let authencicateUser = (req,res,next) => {
//     let token = req.header('x-auth');
//     User.findByToken(token).then(user => {
//         //between functions if we want to pass data we use req object
//         //by using re.locals we can use locals in views (like .pug) also
//         req.locals = {
//             user,
//             token
//         }
//         next();
//     }).catch(err => res.status(401).send(err))
// };

router.get('/profile',authencicateUser,(req,res) => {
    //req.locals
    res.send(req.locals.user.tokens[0].token);
});

//sign in//we are posting because of we can access to req.body
router.post('/login',(req,res) => {
    let body = _.pick(req.body,['email','password']);
    User.findByEmailAndPassword(body.email,body.password).then(user => {
        return user.generateToken().then(token => {
            res.header('x-auth',token).send();
        })
    }).catch(err => res.send(err))
});

//sign up
router.post('/',(req,res) => {
    let body =  _.pick(req.body,['userName','email','mobile','password']);
    let user = new User(body);
    user.save().then((user) => {
        return user.generateToken()
    }).then((token) => {
        res.header('x-auth',token).send(user);//we are passing token data in header//x-auth is a key/parameter

    }).catch((err) => res.send(err));
});


//logout route

router.delete('/logout',authencicateUser,(req,res) => {
    req.locals.user.deleteToken(req.locals.token).then(() =>{
        res.send();
    }).catch(err => console.log(err))
    // User.findOneAndUpdate({_id:req.locals.user._id},{$pull: {tokens:req.locals.token}}, { new: true }).then(data => {
    //     res.send(data)
    //   }).catch(err => res.send(err));
});

module.exports = {
    usersRouter:router
}