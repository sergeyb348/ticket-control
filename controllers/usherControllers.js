const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const ApiError = require('../error/apiError');
const {Usher, Manager} = require('../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require("log4js");
const logger = log4js.getLogger();
const fs = require('fs')

function generateJWT(id, name, email){
    const token = jwt.sign({id, name, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'});
    return token;
}

class UsherControllers{

    async registrationUsher(req, res, next){
        
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

            if(usher.imageSrc)
                fs.unlinkSync(usher.imageSrc)
            await Usher.destroy({where: {id: usher.id}})

            const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

            return res.json({token})
        } catch (error) {            
            return next(ApiError.internal('Неизвестная ошибка БД'));  
        }
    }

    async getUsher(req, res, next){

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

    async uplodaImage(req, res, next){
        logger.info(req.file)
        if(!req.file)
            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.file,
                        msg: "Нету изображения",
                        param: "image",
                        location: "body"
                    }
                ]
            }));
        logger.info(req.file.path)

        const usherDb = await Usher.findOne({where:{id:req.usher.id}})


        if(usherDb.imageSrc)
            fs.unlinkSync(usherDb.imageSrc)

        usherDb.imageSrc = req.file.path;
        usherDb.save();
            

        const token = generateJWT(req.usher.id, req.usher.name, req.usher.email);
        return res.json({token})
    }

    async auth(req, res, next){
        const token = generateJWT(req.usher.id, req.usher.name, req.usher.email)
        return res.json({token})
    }

    async login(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {email, password} = req.body;

        const usher = await Usher.findOne({where: {email: email}})
        
        if(!usher)
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
        
        if(!bcrypt.compareSync(password, usher.password))
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

        const token = generateJWT(usher.id, usher.name, usher.email);
        return res.json({token})    
    }

    async changeEmail(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {email} = req.body;

        try{

            if(!(await Usher.findOne({where: {email: email}})))
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

            const usherDb = await Usher.findOne({where: {id: req.usher.id}})

            usherDb.email = email;
                
            await usherDb.save();

            const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
            return res.json({token})
        }
        catch(error){
            logger.error(error)
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async changeFirstName(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {firstName} = req.body;

        try{
            const usherDb = await Usher.findOne({where: {id: req.usher.id}})

            usherDb.firstName = firstName;
                
            await usherDb.save();

            const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
            return res.json({token})
        }
        catch(error){
            logger.error(error)
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async changeLastName(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {lastName} = req.body;

        try{
            const usherDb = await Usher.findOne({where: {id: req.usher.id}})

            usherDb.lastName = lastName;
                
            await usherDb.save();

            const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
            return res.json({token})
        }
        catch(error){
            logger.error(error)
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async changeSurname(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))
        
        const {surname} = req.body;

        try{
            const usherDb = await Usher.findOne({where: {id: req.usher.id}})

            usherDb.surname = surname;
                
            await usherDb.save();

            const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
            return res.json({token})
        }
        catch(error){
            logger.error(error)
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }

    async changePassword(req, res, next){
        const error = validationResult(req);

        if(!error.isEmpty())
            return next(ApiError.badRequest(error))

        const {newPassword , password} = req.body;
        
        const usherId = req.usher.id
        try{
            const usherDb = await Usher.findOne({where: {id: usherId}})
            console.log(usherDb)

            if(!bcrypt.compareSync(password, usherDb.password))
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

            usherDb.password = hashPassword
            await usherDb.save();

            const token = generateJWT(usherDb.id, usherDb.name, usherDb.email)
            return res.json({token})
        }
        catch(error){
            console.log(error)
            
            return next(ApiError.internal('Неизвестная ошибка БД'));
        }
        
    }
}

module.exports = new UsherControllers();