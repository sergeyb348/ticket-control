const jwt = require("jsonwebtoken");
const {Usher} = require("../models/Model")
const ApiError = require('../error/apiError')
const log4js = require('log4js')

const logger = log4js.getLogger()

module.exports = async function(req, res, next){
    try {
        const token = req.headers.authorization;
        logger.error(token)

        if(!token){
            return next(ApiError.unauthorized("Не авторизован"))
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const usherDb = await Usher.findOne({where: {id: decoded.id}})

        if(!usherDb)
            return next(ApiError.unauthorized("Не авторизован"))
    
        req.usher = decoded;
        next()
    }
    catch(error){
        return next(ApiError.unauthorized("Не авторизован"))
    }
}