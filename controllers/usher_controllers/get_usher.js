const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getUsher = async (req, res, next) => {
    logger.info('getUsher')
        
    try {
        const ushersDb = await Usher.findAll({
            where:{
                managerId:req.manager.id
            }
        })

        if(!ushersDb)
        return next(ApiError.badRequest({
            errors: [
                {
                    value: req.body.email,
                    msg: "Данного сотрудника не существует",
                    param: "usherId",
                    location: "body"
                }
            ]
        }));

        
        let ushers = []
        for(let i = 0; i < ushersDb.length; i++){
            let usher = Object()
            usher.id = ushersDb[i].id
            usher.email = ushersDb[i].email
            usher.firstName = ushersDb[i].firstName
            usher.lastName = ushersDb[i].lastName
            usher.surname = ushersDb[i].surname
            logger.info(usher)
            ushers[i] = usher
            logger.info(ushers)
        }
        
        return res.json({ushers})
    } catch (error) {            
        return next(ApiError.internal('Неизвестная ошибка БД'));  
    }
}

module.exports = getUsher