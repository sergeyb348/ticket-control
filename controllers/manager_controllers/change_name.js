const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeName = async (req, res, next) => {
    logger.info('changeName')
        
    const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))

        const newName = req.body.newName;

        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})

            if(managerDb.name === newName)
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

            managerDb.name = newName
            await managerDb.save();

            const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)

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

module.exports = changeName