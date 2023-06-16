const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const auth = async (req, res, next) => {
    logger.info('auth')
        
    const token = generateJWT(req.usher.id, req.usher.name, req.usher.email)
    return res.json({token})
}

module.exports = auth