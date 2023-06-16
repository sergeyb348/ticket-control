const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const deleteUsher = async (req, res, next) => {
    logger.info('deleteUsher')
    logger.info(req.body)
        
    const error = validationResult(req);

    if(!error.isEmpty())
        return next(ApiError.badRequest(error))
    
    const {usherId} = req.body;
    logger.info(usherId)

    try {
        const usher = await Usher.findOne({
            where:{
                id:usherId,
                managerId:req.manager.id
            }
        })

        if(!usher)
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

        if(usher.imageSrc)
            fs.unlinkSync(usher.imageSrc)
        await Usher.destroy({where: {id: usher.id}})

        const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

        return res.json({token})
    } catch (error) {            
        return next(ApiError.internal('Неизвестная ошибка БД'));  
    }
}

module.exports = deleteUsher