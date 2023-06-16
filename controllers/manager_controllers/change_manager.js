const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeManager = async (req, res, next) => {

    if(!(req.body.newEmail || req.body.newName || (req.body.password && req.body.newPassword)))
        return next(ApiError.badRequest({
            errors: [
                {
                    msg: 'не задано ни одного поля',
                    param: "",
                    location: "body"
                }
            ]
        }));
    const {newEmail, newName, password, newPassword} = req.body;
    logger.debug(newEmail)
    
    const managerId = req.manager.id
    try{
        const managerDb = await Manager.findOne({where: {id: managerId}})
        
        if(managerDb.email === newEmail && newEmail)
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
        
        if(newEmail)
            managerDb.email = newEmail
        
        if(managerDb.name === newName && newName)
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.newName,
                        msg: 'Новое имя не может соответствовать старому',
                        param: "newName",
                        location: "body"
                    }
                ]
            }));
        
        if(newName)
            managerDb.name = newName

        if(newPassword)
            if(!bcrypt.compareSync(password, managerDb.password))
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

        if(newPassword === password && password && newPassword)
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.newPassword,
                        msg: 'Новой пароль не может соответствовать старому',
                        param: "newPassword",
                        location: "body"
                    }
                ]
            }));

        if(newPassword){
            const hashPassword = await bcrypt.hash(newPassword, 5);
            managerDb.password = hashPassword
        }


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

        if(error.parent.constraint === "managers_name_key")
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.newName,
                        msg: 'Данное имя уже зарегистрировано',
                        param: "newName",
                        location: "body"
                    }
                ]
            }));
        
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = changeManager