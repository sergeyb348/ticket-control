

const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getUsher = async (req, res, next) => {
    logger.info(req.params.id)
    const id = req.params.id
    try {
        const usherDb = await Usher.findOne({where:{id: id, managerId: req.manager.id}})
        let usher = new Object()
        usher.id = usherDb.id
        usher.firstName = usherDb.firstName
        usher.lastName = usherDb.lastName
        usher.surname = usherDb.surname
        usher.email = usherDb.email
        logger.info(usher);
        
        return res.json(usher)
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getUsher