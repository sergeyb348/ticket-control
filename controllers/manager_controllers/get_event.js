const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getEvent = async (req, res, next) => {
    logger.info(req.params.id)
    const id = req.params.id
    try {
        const eventDb = await Event.findOne({where:{id: id, managerId: req.manager.id}})
        let event = new Object()
        event.id = eventDb.id
        event.name = eventDb.name
        event.start_time = eventDb.start_time
        event.end_time = eventDb.end_time
        event.description = eventDb.description
        logger.info(event);
        
        return res.json(event)
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getEvent