const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const auth = (req, res, next) => {
    const token = generateJWT(req.manager.id, req.manager.name, req.manager.email)
    return res.json({token})
}

module.exports = auth