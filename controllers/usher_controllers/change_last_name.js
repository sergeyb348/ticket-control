const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeLastName = async (req, res, next) => {
    logger.info('changeLastName')
        
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const {lastName} = req.body;

    try{
        const usherDb = await Usher.findOne({where: {id: req.usher.id}})

        usherDb.lastName = lastName;
            
        await usherDb.save();

        const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
        return res.json({token})
    }
    catch(error){
        logger.error(error)
        return next(ApiError.internal('Неизвестная ошибка БД'));
    } 
}

module.exports = changeLastName