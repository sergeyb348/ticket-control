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

            if(error.parent.constraint === "managers_email_key")
                return next(ApiError.badRequest('Данный email уже зарегистрирован'));

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
        
        if(!bcrypt.compareSync(password, manager.password))
            return next(ApiError.badRequest('Неверный пароль'));
        else{
            const token = generateJWT(manager.id, manager.name, manager.email);
            return res.json({token})
        }          
    }

    async auth(req, res, next){
        const token = generateJWT(req.manager.id, req.manager.name, req.manager.email)
        return res.json({token})
    }

    async changeName(req, res, next){
        const newName = req.body.newName;
        if(!newName)
            return next(ApiError.badRequest('Не заданы все поля'));
        
        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})

            if(managerDb.name === newName)
                return next(ApiError.internal('Новое имя не может соответствовать старому'));

            managerDb.name = newName
            await managerDb.save();

            const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)

            if(error.parent.constraint === "managers_name_key")
                return next(ApiError.badRequest('Данное имя уже зарегистрировано'));
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async changePassword(req, res, next){
        const {newPassword , password} = req.body;

        if(!newPassword || !password)
            return next(ApiError.badRequest('Не заданы все поля'));

        if(newPassword === password)
            return next(ApiError.internal('Новой пароль не может соответствовать старому'));
        
        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})
            console.log(managerDb)

            if(!bcrypt.compareSync(password, managerDb.password))
                return next(ApiError.badRequest('Неверный пароль'));

            const hashPassword = await bcrypt.hash(newPassword, 5);

            managerDb.password = hashPassword
            await managerDb.save();

            const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }
    
    async changeEmail(req, res, next){
        const newEmail = req.body.newEmail;
        if(!newEmail)
            return next(ApiError.badRequest('Не заданы все поля'));
        
        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})

            if(managerDb.email === newEmail)
                return next(ApiError.internal('Новый email не может соответствовать старому'));

            managerDb.email = newEmail
            await managerDb.save();

            const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)

            if(error.parent.constraint === "managers_email_key")
                return next(ApiError.badRequest('Данный email уже зарегистрирован'));
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async deleteManager(req, res, next){
        const {password} = req.body;

        if(!password)
            return next(ApiError.badRequest('Не заданы все поля'));
        
        const managerId = req.manager.id
        try{

            const managerDb = await Manager.findOne({where: {id: managerId}})

            console.log(managerDb.password)
            if(!bcrypt.compareSync(password, managerDb.password))
                return next(ApiError.badRequest('Неверный пароль'));

            await Manager.destroy({where: {id: managerId}})
            
            return res.json({message: "Аккаунт удален"})
        }
        catch(error){
            console.log(error)
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }
}

module.exports = new ManagerControllers();