const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changePassword = async (req, res, next)=>{
    logger.info("changePassword")
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))

    const {newPassword , password} = req.body;
    
    const managerId = req.manager.id
    try{
        const managerDb = await Manager.findOne({where: {id: managerId}})

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

        if(newPassword === password)
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

        const hashPassword = await bcrypt.hash(newPassword, 5);

        managerDb.password = hashPassword
        await managerDb.save();

        const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
        return res.json({token})
    }
    catch(error){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
    
}

module.exports = changePassword