const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeEmail = async (req, res, next) => {
        
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const newEmail = req.body.newEmail;
    
    const managerId = req.manager.id
    try{
        const managerDb = await Manager.findOne({where: {id: managerId}})

        if(managerDb.email === newEmail)
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.newEmail,
                        msg: 'Новый email не может соответствовать старому',
                        param: "newEmail",
                        location: "body"
                    }
                ]
            }));

        managerDb.email = newEmail
        await managerDb.save();

        const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
        return res.json({token})
    }
    catch(error){
        console.log(error)

        if(error.parent.constraint === "managers_email_key")
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.newEmail,
                        msg: 'Данный email уже зарегистрирован',
                        param: "newEmail",
                        location: "body"
                    }
                ]
            }));
        
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = changeEmail