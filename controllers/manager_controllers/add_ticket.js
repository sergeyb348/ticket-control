const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Ticket} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const jwt = require("jsonwebtoken");
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');

const logger = log4js.getLogger();

const generateJWT = (id, email) =>{
    const token = jwt.sign({id, email},
        process.env.SECRET_KEY
        );
    return token;
}

const addTicket = async (req, res, next) => {
    logger.info('addTicket')
        
    
        const {categId, email, description} = req.body;
        logger.info(categId)
        logger.info(req.body)

        try {
            

            const t = generateJWT(categId, email)
            QRCode.toFile('D:\\UCZ\\Dipl\\ticket-control\\uploads\\qr.png', t, {
                errorCorrectionLevel: 'H'
              }, function(err) {
                if (err) throw err;
                logger.debug('QR code saved!');
              });
            

            const transport = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                auth: {
                    user: 'sergeyb348@gmail.com', // my mail
                    pass: 'xnmfmwtwptgdxztn'
                }
            }));

            let result = await transport.sendMail({
                from: process.env.EMAIL_NAME,
                to: email,
                subject: 'Ticket-control',
                text: description,
                attachments: [
                    {   // utf-8 string as an attachment
                        filename: 'qr.png',
                        path:"D:\\UCZ\\Dipl\\ticket-control\\uploads\\qr.png"
                    }
                ]
            }, err => logger.error(err));
            logger.info(categId)
            const ticketDb = await Ticket.create({
                email: email,
                ticket: t,
                description: description,
                categId:categId,
                status:"inactiv"
            })

            logger.error(ticketDb)

            const token = generateJWT(req.manager.id, req.manager.name, req.manager.email);

            return res.json({token})
        } catch (error) {
            logger.error(error)

            return next(ApiError.badRequest({
                errors: [
                    {
                        value: req.body.email,
                        msg: "Данное имя уже занято",
                        param: "email",
                        location: "body"
                    }
                ]
            }));
                

            return next(ApiError.internal('Неизвестная ошибка БД'));   
        }
}

module.exports = addTicket