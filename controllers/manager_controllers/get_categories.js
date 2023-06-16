const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Categ} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getCategories = async (req, res, next) => {
    const id = req.params.id
    
    try {
        const categDb = await Categ.findAll({where:{eventId: id}})
        
        const categs = categDb.map(c => {
            let categ = new Object()
            categ.id = c.id
            categ.name = c.name
            categ.number = c.number
            categ.status = c.status
            categ.eventId = c.eventId
            logger.error(categ)
            return categ
        })
        logger.info(categs);
        
        return res.json(categs)
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getCategories