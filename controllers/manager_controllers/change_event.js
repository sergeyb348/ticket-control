const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const changeEvent = async (req, res, next) => {
    logger.info('changeEvent')
    
    const {name, description, start_time, end_time, eventId} = req.body;

    try{
        const eventDb = await Event.findOne({where: {id: eventId}})
        
        
        eventDb.name = name
        eventDb.description = description
        eventDb.start_time = start_time
        eventDb.end_time = end_time
        
        await eventDb.save();
        const token = generateJWT(req.manager.body, req.manager.name, req.manager.email)
        return res.json({token})
    }
    catch(error){
        console.log(error)
        
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = changeEvent