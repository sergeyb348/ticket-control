const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const login = async (req, res, next) => {
    logger.info('login')
        
    const error = validationResult(req);
    logger.info(req.body)
    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const {email, password} = req.body;

    const usher = await Usher.findOne({where: {email: email}})
    
    if(!usher)
        return next(ApiError.badRequest({
            errors: [
                {
                    value: req.body.email,
                    msg: 'Такого пользователя не существует',
                    param: "email",
                    location: "body"
                }
            ]
        }));
    
    if(!bcrypt.compareSync(password, usher.password))
        return next(ApiError.badRequest({
            errors: [
                {
                    value: req.body.password,
                    msg: 'Неверный пароль',
                    param: "password",
                    location: "body"
                }
            ]
        }));

    const token = generateJWT(usher.id, usher.name, usher.email);
    return res.json({token})  
}

module.exports = login