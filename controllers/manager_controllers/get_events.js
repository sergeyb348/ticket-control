const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getEvents = async (req, res, next) => {
    try {
        const eventDb = await Event.findAll({where:{managerId: req.manager.id}})
        const events = eventDb.map(e => {
            let event = new Object()
            event.id = e.id
            event.name = e.name
            event.start_time = e.start_time
            event.end_time = e.end_time
            let s_t = new Date(Date.parse(event.start_time))
            let e_t = new Date(Date.parse(event.end_time))
            let n_t = new Date()
            if((s_t < n_t && e_t > n_t))
                event.status = 'activ'
            if(s_t > n_t)
                event.status = 'wait'
            if(e_t < n_t)
                event.status = 'end'
            logger.debug(event.status)
            logger.debug((s_t < n_t && e_t > n_t))
            logger.debug(s_t)
            logger.debug(e_t)
            logger.debug(n_t)
            event.description = e.description
            return event
        })
        logger.info(events);
        
        return res.json(events)
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
    return res.json({token})
}

module.exports = getEvents