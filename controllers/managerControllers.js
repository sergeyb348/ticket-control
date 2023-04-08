const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const ApiError = require('../error/apiError');
const {Manager, Usher} = require('../models/Model');
const { validationResult } = require('express-validator/check');

function generateJWT(id, name, email){
    const token = jwt.sign({id, name, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'});
    return token;
}

class ManagerControllers{
    
    async registration(req, res, next){
        
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {email, name, password} = req.body;
        
        const hashPassword = await bcrypt.hash(password, 5);

        try {
            const manager = await Manager.create({name: name, email: email, password: hashPassword})

            const token = generateJWT(manager.id, manager.name, manager.email);

            return res.json({token})
        } catch (error) {

            if(error.parent.constraint === "managers_name_key")
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.name,
                            msg: "Данное имя уже зарегистрировано",
                            param: "name",
                            location: "body"
                        }
                    ]
                }));

            if(error.parent.constraint === "managers_email_key")
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.email,
                            msg: "Данный email уже зарегистрирован",
                            param: "email",
                            location: "body"
                        }
                    ]
                }));

            return next(ApiError.internal('Неизвестная ошибка БД'));   
        }
    }

    async login(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {email, password} = req.body;

        const manager = await Manager.findOne({where: {email: email}})
        
        if(!manager)
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.email,
                        msg: 'Такого пользователя не существует',
                        param: "email",
                        location: "body"
                    }
                ]
            }));
        
        if(!bcrypt.compareSync(password, manager.password))
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

        const token = generateJWT(manager.id, manager.name, manager.email);
        return res.json({token})    
    }

    async auth(req, res, next){
        const token = generateJWT(req.manager.id, req.manager.name, req.manager.email)
        return res.json({token})
    }

    async changeName(req, res, next){

        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))

        const newName = req.body.newName;

        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})

            if(managerDb.name === newName)
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.newName,
                            msg: 'Новое имя не может соответствовать старому',
                            param: "newName",
                            location: "body"
                        }
                    ]
                }));

            managerDb.name = newName
            await managerDb.save();

            const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)

            if(error.parent.constraint === "managers_name_key")
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.newName,
                            msg: 'Данное имя уже зарегистрировано',
                            param: "newName",
                            location: "body"
                        }
                    ]
                }));
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async changePassword(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))

        const {newPassword , password} = req.body;
        
        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})
            console.log(managerDb)

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

            if(newPassword === password)
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.newPassword,
                            msg: 'Новой пароль не может соответствовать старому',
                            param: "newPassword",
                            location: "body"
                        }
                    ]
                }));

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
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const newEmail = req.body.newEmail;
        
        const managerId = req.manager.id
        try{
            const managerDb = await Manager.findOne({where: {id: managerId}})

            if(managerDb.email === newEmail)
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.newEmail,
                            msg: 'Новый email не может соответствовать старому',
                            param: "newEmail",
                            location: "body"
                        }
                    ]
                }));

            managerDb.email = newEmail
            await managerDb.save();

            const token = generateJWT(managerDb.id, managerDb.name, managerDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)

            if(error.parent.constraint === "managers_email_key")
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.newEmail,
                            msg: 'Данный email уже зарегистрирован',
                            param: "newEmail",
                            location: "body"
                        }
                    ]
                }));
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async deleteManager(req, res, next){
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

    async addUsher(req, res, next){
        
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {email, firstName, lastName, surname, password} = req.body;
        
        const hashPassword = await bcrypt.hash(password, 5);

        try {
            const usher = await Usher.create({
                email: email, 
                firstName: firstName,
                lastName: lastName,
                surname: surname,
                password: hashPassword,
                managerId: req.manager.id
            })

            const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

            return res.json({token})
        } catch (error) {

            console.log(error.parent.constraint )

            if(error.parent.constraint === "ushers_email_key")
                return next(ApiError.badRequest({
                    errors: [
                        {
                            value: req.body.email,
                            msg: "Данный email уже зарегистрирован",
                            param: "email",
                            location: "body"
                        }
                    ]
                }));

            return next(ApiError.internal('Неизвестная ошибка БД'));   
        }
    }

    async deleteUsher(req, res, next){
        
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {usherId} = req.body;

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

            await Usher.destroy({where: {id: usher.id}})

            const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

            return res.json({token})
        } catch (error) {

            console.log(error)
            
            return next(ApiError.internal('Неизвестная ошибка БД'));  
        }
    }
}

module.exports = new ManagerControllers();