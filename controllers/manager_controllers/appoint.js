const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {EventUsher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js');
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();


const appoint = async (req, res, next) => {
    logger.info('appoint')
        
        
        const {eventId, usherId} = req.body;

        try {
            const appointId = await EventUsher.create({
                usherId: usherId,
                eventId: eventId
            })

            logger.error(appointId)
            logger.error(req.manager.id)
            logger.error(req.manager.name)
            logger.error(req.manager.email)

            const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

            return res.json({token})
        } catch (error) {
            logger.error(error)

            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.email,
                        msg: "Данное имя уже занято",
                        param: "email",
                        location: "body"
                    }
                ]
            }));
                

            return next(ApiError.internal('Неизвестная ошибка БД'));   
        }
}

module.exports = appoint