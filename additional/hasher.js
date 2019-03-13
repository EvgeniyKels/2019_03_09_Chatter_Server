const PasswordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const Joi = require('joi');

let hash = async function hasher(user) {
    const saltRounds = 10; //todo ма зэ
    const plainPassword = user.password;
    if (!passwordComplex(plainPassword)) {
        return false;
    }
    user.password = await bcrypt.hash(plainPassword, saltRounds);
    return user;
};

function passwordComplex(plainPass) {
    const complexityOptions = {
        min: 3,
        max: 16,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
    };

    return Joi.validate(plainPass, new PasswordComplexity(complexityOptions), (err, value) => {
        return !err;
    });
}

module.exports.compar = (password, dbPassword) => {
    return bcrypt.compare(password, dbPassword);
};

module.exports.hashFunc = hash;