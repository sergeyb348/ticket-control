const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Manager} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')

const logger = log4js.getLogger();

const deleteManager = async (req, res, next) => {
    logger.info('deleteManager')
        
    const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))

        const {password} = req.body;

        const managerId = req.manager.id
        try{

            const managerDb = await Manager.findOne({where: {id: managerId}})

            console.log(managerDb.password)
            if(!bcrypt.compareSync(password, managerDb.password))
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.password,
                            msg: 'Неверный пароль',
                            param: "password",
                            location: "body"
                        }
                    ]
                }));

            await Manager.destroy({where: {id: managerId}})
            
            return res.json({message: "Аккаунт удален"})
        }
        catch(error){
            console.log(error)
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
}

module.exports = deleteManager