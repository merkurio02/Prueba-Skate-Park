const jwt = require('jsonwebtoken');

const KEY = 'secret';

const getToken = (user) => {
    user.password = undefined;
    const token=jwt.sign(user, KEY, { expiresIn: '1h' });
    console.log(token);
    return token;
}

const  verifyToken = (token) => {
    return jwt.verify(token, KEY);
}

module.exports = {getToken, verifyToken};