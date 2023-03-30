const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const ApiError = require('../error/apiError');
const {Manager} = require('../models/Model');
const { where } = require("sequelize");

function generateJWT(id, name, email){
    const token = jwt.sign({id, name, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'});
    return token;
}

class ManagerControllers{
    async registration(req, res, next){  
        const {email, name, password} = req.body;
        if(!email || !name || !password)
            return next(ApiError.badRequest('Не заданы все поля'));
        
        const hashPassword = await bcrypt.hash(password, 5);

        try {
            const manager = await Manager.create({name: name, email: email, password: hashPassword})

            const token = generateJWT(manager.id, manager.name, manager.email);

            return res.json({token})
        } catch (error) {
            console.log(error);

            if(error.parent.constraint === "managers_name_key")
                return next(ApiError.badRequest('Данное имя уже зарегистрировано'));

            else if(error.parent.constraint === "managers_email_key")
                return next(ApiError.badRequest('Данный email уже зарегистрирован'));
            else
                return next(ApiError.internal('Неизвестная ошибка БД'));
            
        }
        
    }

    async login(req, res, next){
        const {email, password} = req.body;

        if(!email || !password)
            return next(ApiError.badRequest('Не заданы все поля'));

        const manager = await Manager.findOne({where: {email: email}})

        if(!manager)
            return next(ApiError.badRequest('Такого пользователя не существует'));
        
        const comparePassword = bcrypt.compareSync(password, manager.password);
        if(!bcrypt.compareSync(password, manager.password))
            return next(ApiError.badRequest('Неверный пароль'));
        else{
            const token = generateJWT(manager.id, manager.name, manager.email);
            return res.json({token})
        }          
    }

    async auth(req, res, next){
        const token = generateJWT(req.id, req.name, req.email)
        return res.json({token})
    }
}

module.exports = new ManagerControllers();