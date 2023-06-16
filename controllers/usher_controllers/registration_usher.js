const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');
const smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require("nodemailer");

const logger = log4js.getLogger();

const registrationUsher = async (req, res, next) => {
    logger.info('registrationUsher')
        
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

        const transport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'sergeyb348@gmail.com', // my mail
                pass: 'xnmfmwtwptgdxztn'
            }
        }));

        logger.info(email)


        let result = await transport.sendMail({
            from: process.env.EMAIL_NAME,
            to: email,
            subject: 'Ticket-control',
            text: `Здраствуйте, ваш пароль от аккауна в Ticket-control : ${password}`,
        }, err => logger.error(err));


        logger.error(result)
        logger.error(result)
        

        const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

        return res.json({token})
    } catch (error) {
        logger.error(error)
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

module.exports = registrationUsher