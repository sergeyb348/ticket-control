const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const deleteEvent = async (req, res, next) => {
    logger.info('deleteEvent')
    
    const {eventId} = req.body;

    try {
        const event = await Event.findOne({
            where:{
                id:eventId,
                managerId:req.manager.id
            }
        })
        logger.info(event)
        if(!event)
        return next(ApiError.badRequest({
            errors: [
                {
                    value: req.body.email,
                    msg: "Данного мероприятия не существует",
                    param: "eventId",
                    location: "body"
                }
            ]
        }));

        const eventDb = await Event.destroy({
            where:{
                id:eventId,
                managerId:req.manager.id
            }
        })

        const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

        return res.json({token})
    } catch (error) {            
        return next(ApiError.internal('Неизвестная ошибка БД'));  
    }
}

module.exports = deleteEvent