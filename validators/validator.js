const Joi = require('joi');

function joiValidator(req, res, schema) {
    const result = Joi.validate(req.body, schema);
    let a = true;
    if (result.error != null) {
        const message = result.error.details
            .map((d) => d.message)
            .reduce((res, cur) => res + ';' + cur);
        res.status(400).send(message);
        a = false;
    }
    return a;
}

module.exports=joiValidator;