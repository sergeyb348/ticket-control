const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const ApiError = require('../error/apiError');
const {Usher, Manager} = require('../models/Model');
const { validationResult } = require('express-validator/check');

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

            console.log(usher)

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

}

module.exports = new UsherControllers();