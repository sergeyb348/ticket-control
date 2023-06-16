const jwt = require("jsonwebtoken");

const generateJWT = (id, name, email) =>{
    const token = jwt.sign({id, name, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'});
    return token;
}

module.exports = generateJWT;