const validateObject = require("./validateObject");

function validatePost(req, res, next) {
    let post =
    {
        text: req.body.text
    }

    let str = validateObject(post);
    if(str !== "") res.status(400).json({error: `missed data: needs ${str}`});
    req.data = post;
    next();
};

module.exports = validatePost;