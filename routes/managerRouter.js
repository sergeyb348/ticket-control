const { Router } = require("express");

const authManagerMiddlewaer = require('../middlewaer/authManagerMiddlewaer')
const { check } = require('express-validator/check');
const log4js = require('log4js')

const registration  = require("../controllers/manager_controllers/registration");
const login  = require("../controllers/manager_controllers/login");
const auth  = require("../controllers/manager_controllers/auth");
const changePassword  = require("../controllers/manager_controllers/change_password");
const changeName  = require("../controllers/manager_controllers/change_name");
const changeEmail  = require("../controllers/manager_controllers/change_email");
const deleteManager  = require("../controllers/manager_controllers/delete_manager");
const addEvent  = require("../controllers/manager_controllers/add_event");
const changeManager = require("../controllers/manager_controllers/change_manager");
const getEvents = require("../controllers/manager_controllers/get_events");
const getEvent = require("../controllers/manager_controllers/get_event");
const getUshers = require("../controllers/manager_controllers/get_ushers");
const getUsher = require("../controllers/manager_controllers/get_usher");
const getManager = require("../controllers/manager_controllers/get_manager");
const addCategory = require("../controllers/manager_controllers/add_category");
const getCategories = require("../controllers/manager_controllers/get_categories");
const addTicket = require("../controllers/manager_controllers/add_ticket");
const changeEvent = require("../controllers/manager_controllers/change_event");
const deleteEvent = require("../controllers/manager_controllers/delete_event");
const appoint = require("../controllers/manager_controllers/appoint");
const getUsherEvent = require("../controllers/manager_controllers/get_usher_event");
const removeFromEvent = require("../controllers/manager_controllers/remove_from_event");

const logger = log4js.getLogger();

const managerRouter = new Router();

logger.info(typeof(registration))


managerRouter.post('/registration',
    [
        check('name').not().isEmpty().withMessage('Имя не задано').
        isLength({min:4, max: 24}).withMessage('имя должно включать от 4 до 24 символов'),
        check('email').not().isEmpty().withMessage('Email не задан').
        isEmail().withMessage('Неверный email'),
        check('password').not().isEmpty().withMessage('пароль не задан').
        isLength({min:6, max: 24}).withMessage('пароль должно включать от 6 до 24 символов')
    ],
    registration
);

managerRouter.post('/login',
    [
        check('email').not().isEmpty().withMessage('Email не задан'),
        check('password').not().isEmpty().withMessage('пароль не задан')
    ],  
    login
);

managerRouter.get('/auth',
    authManagerMiddlewaer,
    auth
);

managerRouter.get('/',
    authManagerMiddlewaer,
    getManager
);

managerRouter.get('/events',
    authManagerMiddlewaer,
    getEvents
);

managerRouter.get('/event/:id',
    authManagerMiddlewaer,
    getEvent
);

managerRouter.get('/ushers',
    authManagerMiddlewaer,
    getUshers
);

managerRouter.get('/usher/:id',
    authManagerMiddlewaer,
    getUsher
);

managerRouter.get('/categories/:id',
    authManagerMiddlewaer,
    getCategories
);

managerRouter.get('/event/ushers/:id',
    authManagerMiddlewaer,
    getUsherEvent
);

managerRouter.post('/event',
    authManagerMiddlewaer,
    addEvent
);

managerRouter.post('/category',
    authManagerMiddlewaer,
    addCategory
);

managerRouter.patch('/name',
    [
        check('newName').not().isEmpty().withMessage('Имя не задано').
        isLength({min:4, max: 24}).withMessage('имя должно включать от 4 до 24 символов')
    ],
    authManagerMiddlewaer,
    changeName
);

managerRouter.patch('/password',
    [
        check('password').not().isEmpty().withMessage('пароль не задан'),
        check('newPassword').not().isEmpty().withMessage('новый пароль не задан').
        isLength({min:6, max: 24}).withMessage('пароль должно включать от 6 до 24 символов')
    ],
    authManagerMiddlewaer,
    changePassword
);

managerRouter.patch('/email',
    [
        check('newEmail').not().isEmpty().withMessage('Email не задан').
        isEmail().withMessage('Неверный email')
    ],
    authManagerMiddlewaer,
    changeEmail
);

managerRouter.patch('/',
    authManagerMiddlewaer,
    changeManager
);
managerRouter.patch('/event',
    authManagerMiddlewaer,
    changeEvent
);

managerRouter.post('/delete',
    [
        check('password').not().isEmpty().withMessage('пароль не задан')
    ],
    authManagerMiddlewaer,
    deleteManager
);

managerRouter.post('/ticket',
    authManagerMiddlewaer,
    addTicket
);

managerRouter.post('/event/delete',
    authManagerMiddlewaer,
    deleteEvent
);

managerRouter.post('/appoint',
    authManagerMiddlewaer,
    appoint
);

managerRouter.post('/event/remove',
    authManagerMiddlewaer,
    removeFromEvent
);



module.exports = managerRouter;