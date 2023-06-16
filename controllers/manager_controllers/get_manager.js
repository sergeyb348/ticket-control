const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getManager = async (req, res, next) => {
    try {
        const managerDb = await Manager.findOne({where:{id: req.manager.id}})
        logger.info('m')
        
        return res.json({
            email: managerDb.email,
            name: managerDb.name
        })
    }
    catch(e){
        return next(ApiError.internal('Неизвестная ошибка БД'));
    }
}

module.exports = getManager