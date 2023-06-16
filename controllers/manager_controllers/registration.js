const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');
const bcrypt = require('bcrypt');
const logger = log4js.getLogger();
const registration = async (req, res, next) => {
    logger.info('registration')
    const error = validationResult(req);
    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    const {email, name, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 5);
    try {
        const manager = await Manager.create({name: name, email: email, password: hashPassword})
        const token = generateJWT(manager.id, manager.name, manager.email);
        return res.json({token})
    } catch (error) {
        if(error.parent.constraint === "managers_name_key")
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.name,
                        msg: "Данное имя уже зарегистрировано",
                        param: "name",
                        location: "body"
                    }
                ]
            }));
        if(error.parent.constraint === "managers_email_key")
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.email,
                        msg: "Данный email уже зарегистрирован",
                        param: "email",
                        location: "body"
                    }
                ]
            }));
        return next(ApiError.internal('Неизвестная ошибка БД'));   
    }
}
module.exports = registration