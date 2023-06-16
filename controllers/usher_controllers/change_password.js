const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changePassword = async (req, res, next) => {
    logger.info('changePassword')
        
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))

    const {newPassword , password} = req.body;
    
    const usherId = req.usher.id
    try{
        const usherDb = await Usher.findOne({where: {id: usherId}})
        console.log(usherDb)

        if(!bcrypt.compareSync(password, usherDb.password))
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

        usherDb.password = hashPassword
        await usherDb.save();

        const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
        return res.json({token})
    }
    catch(error){
        console.log(error)
        
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = changePassword