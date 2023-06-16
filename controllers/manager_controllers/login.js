const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const login = async (req, res, next) => {
    logger.info("login")
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const {email, password} = req.body;
    logger.info(email)
    logger.info(password)

    const manager = await Manager.findOne({where: {email: email}})
    
    if(!manager)
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
    
    if(!bcrypt.compareSync(password, manager.password))
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

    const token = generateJWT(manager.id, manager.name, manager.email);
    return res.json({token})    
}

module.exports = login