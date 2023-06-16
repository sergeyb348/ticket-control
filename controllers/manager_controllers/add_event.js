const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const addEvent = async (req, res, next) => {
    logger.info('addEvent')
        
    const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        
        const {name, start_time, end_time, description} = req.body;
        logger.info(name)

        try {
            const event = await Event.create({
                managerId: req.manager.id,
                name: name,
                start_time: start_time,
                end_time: end_time,
                description: description
            })

            logger.error(event)

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

module.exports = addEvent