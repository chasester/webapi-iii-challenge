const express = require('express');
const db = require('./userDb');
const db_post = require('../posts/postDb');

const router = express.Router();

const validateObject = require('../utls/validateObject');
const validatePost = require('../utls/validatePost');

router.post('/', validateUser, 
    (req, res, next) => 
    {
        console.log(req.user);
        db.insert(req.user)
        .then(result => {req.params.id = result.id; next()})
        .catch(error => res.status(500).json({error: error, message: "name must be unique"}))
    } ,
    validateUserId, 
    (req,res) => res.status(201).json(req.user)
);

router.post('/:id/posts', 
    validateUserId, validatePost, 
    (req, res) => 
    {
        req.data.user_id = req.user.id;
        db_post.insert(req.data)
        .then(() => {
            db.getUserPosts(req.user.id)
            .then(result => res.status(200).json(result))
            .catch((err) => res.status(500).json({error: err, message: "Could not fetch any post from this user."}));
        })
        .catch(() => res.send("interal error"))
    }
);

router.get('/', (req, res) => {
    db.get()
    .then(result => 
    {
        if(!result || result.length === 0) return res.status(500).json({message: "no users exist"});
        res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({error: err, message: "Could not fetch any data from users table."}));
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    db.getUserPosts(req.user.id)
    .then(result => res.status(200).json(result))
    .catch((err) => res.status(500).json({error: err, message: "Could not fetch any post from this user."}));
});

router.delete('/:id', validateUserId, (req, res) => {
    db.remove(req.user.id)
    .then(()=> res.status(202).json({message: "item deleted"}))
    .catch((err) => req.status(500).json({error: err, message: "item requested to be deleted but may not have been deleted"}));
});

router.put('/:id', validateUserId, validateUser, (req, res, next) =>
    {
        //req.user.id = req.params.id;
        db.update(req.params.id, req.user)
        .then(() => next())
        .catch(err => res.status(500).json({error: err, message: "item requested to be added but may or may not have been added"}))
    },
    validateUserId,
    (req,res) =>{res.status(200).json(req.user);}
);

//custom middleware

function validateUserId(req, res, next) {
    if(!req.params || !req.params.id || !parseInt(req.params.id) || req.params.id < 1) return res.status(400).json({error: "id is not defined"});
    db.getById(req.params.id)
    .then(result =>
    {
        if(!result || result.length==0) return res.status(400).json({error: "this id does not exist"})
        req.user = result;
        next();
    })
    .catch(error => res.status(500).json({error: error, message: "internal error of data"}) )
};

function validateUser(req, res, next) { 
    let user =
    {
        name: req.body.name !== "" ? req.body.name : undefined
    }

    let str = validateObject(user);
    if(str !== "") res.status(400).json({error: `missed data: needs ${str}`});
    req.user = user;
    next();
};

module.exports = router;
