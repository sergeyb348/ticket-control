const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeFirstName = async (req, res, next) => {
    logger.info('changeFirstName')
        
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const {firstName} = req.body;

    try{
        const usherDb = await Usher.findOne({where: {id: req.usher.id}})

        usherDb.firstName = firstName;
            
        await usherDb.save();

        const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
        return res.json({token})
    }
    catch(error){
        logger.error(error)
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = changeFirstName