const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeEmail = async (req, res, next) => {
    logger.info('changeEmail')
        
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const {email} = req.body;

    try{

        if(!(await Usher.findOne({where: {email: email}})))
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

        const usherDb = await Usher.findOne({where: {id: req.usher.id}})

        usherDb.email = email;
            
        await usherDb.save();

        const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
        return res.json({token})
    }
    catch(error){
        logger.error(error)
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = changeEmail