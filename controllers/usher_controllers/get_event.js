const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getEvent = async (req, res, next) => {
    logger.info('getEvent')
        
    const error = validationResult(req);
    logger.info(req.body)

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const usherId = req.usher.id
    try{
        const usherDb = await Usher.findOne({where: {id: usherId}})
        return res.json({'event': 'event'})

    }
    catch(error){
        console.log(error)
        
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getEvent