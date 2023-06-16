

const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Usher, dbSequelize, EventUsher, Event} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getUsherEvent = async (req, res, next) => {
    logger.info(req.params.id)
    const id = req.params.id
    try {
        
        const usherEventDb = await Event.findOne({
            where:{
                id: id
            },
            include:Usher
        })
        
        logger.debug(usherEventDb.ushers)

        const ushers = usherEventDb.ushers.map(u => {
            let usher = new Object()
            usher.id = u.id
            usher.firstName = u.firstName
            usher.lastName = u.lastName
            usher.surname = u.surname
            usher.email = u.email
            return usher
        })
        logger.info(ushers);
        
        return res.json(ushers)
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getUsherEvent