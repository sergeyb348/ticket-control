

const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Usher, dbSequelize, EventUsher, Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getUsherEvents = async (req, res, next) => {
    const id  = req.usher.id
    logger.info(id)
    try {
        
        const usherEventDb = await Usher.findOne({
            where:{
                id: id
            },
            include:Event
        })
        
        logger.debug(usherEventDb.events)

        const result = usherEventDb.events.map(u => {
            let event = new Object()
            event.event_id = u.id
            event.event_name = u.name
            event.event_start = (u.start_time.toLocaleDateString('ru-RU',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + u.start_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
            event.event_end = ((u.end_time.toLocaleDateString('ru-RU',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + u.end_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })))
            return event
        })
        logger.info(result);
        
        return res.json({result})
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getUsherEvents