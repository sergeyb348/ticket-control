

const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Usher, dbSequelize, EventUsher, Event,Categ, Ticket} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const getTicket = async (req, res, next) => {
    
    
    const {event_id, name, qr} = req.body
    
    try {
        const eventDb = await Event.findOne({
            where:{
                id: event_id
            }
        })

        let s_t = new Date(Date.parse(eventDb.start_time))
        let e_t = new Date(Date.parse(eventDb.end_time))
        let n_t = new Date()
        
        const categDb = await Categ.findOne({
            where:{
                eventId: event_id
            },
            include: {
                model: Ticket,
                where:{
                    ticket: qr
                }
            }
        })
        logger.info(categDb.tickets[0].status)

        if(categDb.tickets[0].status === 'inactiv'){

            if(s_t > n_t)
                return res.json({ms:`none`, status:`time_w` })
            if(e_t < n_t)
                return res.json({ms:`none`, status:`time_e` })

            const ticketDb = await Ticket.findOne({
                where:{
                    ticket: qr
                }
            })
            ticketDb.status = "activ"
            ticketDb.save()
            return res.json({ms:`${categDb.name}`, status:`inactiv` })
        }
        if(s_t > n_t)
            return res.json({ms:`none`, status:`time_w` })
        if(e_t < n_t)
            return res.json({ms:`none`, status:`time_e` })

        return res.json({ms:`${categDb.name}`, status:`activ` })
    }
    catch(e){
        return res.json({ms:`none`, status:`none` })
    }
}

module.exports = getTicket