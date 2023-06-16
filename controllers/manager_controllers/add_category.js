const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Categ} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const addCategory = async (req, res, next) => {
    logger.info('addCategory')
        
    const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        
        const {name, number, eventId} = req.body;
        logger.info(name)
        logger.info(number)
        logger.info(eventId)

        try {
            const categoryDb = await Categ.create({
                eventId: eventId,
                name: name,
                status: 'inactiv',
                number: number
            })

            logger.info(categoryDb)

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
        }
}

module.exports = addCategory