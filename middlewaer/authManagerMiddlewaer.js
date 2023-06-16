const jwt = require("jsonwebtoken");
const {Manager} = require("../models/Model")
const ApiError = require('../error/apiError')
const log4js = require('log4js')

const logger = log4js.getLogger();

module.exports = async function(req, res, next){
    try {
        const token = req.headers.authorization;

        if(!token){
            return next(ApiError.unauthorized("Не авторизован"))
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const managerDb = await Manager.findOne({where: {id: decoded.id}})

        if(!managerDb)
            return next(ApiError.unauthorized("Не авторизован"))
    
        req.manager = decoded;
        next()
    }
    catch(error){
        return next(ApiError.unauthorized("Не авторизован"))
    }
}