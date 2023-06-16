const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getUshers = async (req, res, next) => {
    try {
        const usherDb = await Usher.findAll({where:{managerId: req.manager.id}})
        const ushers = usherDb.map(u => {
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

module.exports = getUshers