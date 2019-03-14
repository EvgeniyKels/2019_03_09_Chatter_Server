let express = require('express');
const jwt = require('jsonwebtoken');
let router = express.Router();
const constants = require('../const_var');
const hash = require('../additional/hasher');
const Database = require('../database');
const config = require('config');
const SECRET = config.get('secret');
const database = new Database();
const UserTab = database.getAuthUserSchema();
database.connect();

const Joi = require('joi');
const validate = require('../validators/validator');

const schema = {
    name: Joi.string().required(),
    password: Joi.string().required(),
};

const loginSchema = {
    name: Joi.string().required(),
    password: Joi.string().required()
};

router.post('/signup', async (req, res) => { //sign up
    if (validate(req, res, schema)) {
        const user = req.body;
        user["roles"] = "user";
        user["messages"] = [];
        const hashUser = await hash.hashFunc(user);
        if (!hashUser) {
            res.send(constants.BAD_PASSWORD);
            return
        }
        const newUserTab = new UserTab(hashUser);
        try {
            await newUserTab.save();
            res.send(constants.USER_ADDED);
        } catch (e) {
            res.status(400).send(constants.USER_NOT_ADDED); //todo проверить статус
        }
    }
});

router.put('/login', async (req, res) => {
    if (validate(req, res, loginSchema)) {
        try {
            let user = await UserTab.findOne({name: req.body.name});
            if (!user || !(await hash.compar(req.body.password, user.password))) {
                res.status(401).send('user is not authorised'); //todo проверить статус
            } else {
                res.send({
                    jwt: jwt.sign({name: user.name, roles: user.roles, _id: user._id}, SECRET),
                    name: user.name
            });

            }
        } catch (e) {
            res.send(e)
        }
    }
});

module.exports = router;