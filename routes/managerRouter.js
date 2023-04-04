const { Router } = require("express");
const ManagerControllers = require('../controllers/managerControllers')
const authManagerMiddlewaer = require('../middlewaer/authManagerMiddlewaer')
const { check, body } = require('express-validator/check');
const { Manager } = require("../models/Model");

const managerRouter = new Router();


managerRouter.post(
    '/registration',
    [
        check('name').not().isEmpty().withMessage('Имя не задано').
        isLength({min:4, max: 24}).withMessage('имя должно включать от 4 до 24 символов'),
        check('email').not().isEmpty().withMessage('Email не задан').
        isEmail().withMessage('Неверный email'),
        check('password').not().isEmpty().withMessage('пароль не задан').
        isLength({min:6, max: 24}).withMessage('пароль должно включать от 6 до 24 символов')
    ],
    ManagerControllers.registration
);

managerRouter.post('/login',
    [
        check('email').not().isEmpty().withMessage('Email не задан'),
        check('password').not().isEmpty().withMessage('пароль не задан')
    ],  
    ManagerControllers.login
);

managerRouter.get('/',authManagerMiddlewaer, ManagerControllers.auth);

managerRouter.patch('/name',
    [
        check('newName').not().isEmpty().withMessage('Имя не задано').
        isLength({min:4, max: 24}).withMessage('имя должно включать от 4 до 24 символов')
    ],
    authManagerMiddlewaer,
    ManagerControllers.changeName
);

managerRouter.patch('/password',
    [
        check('password').not().isEmpty().withMessage('пароль не задан'),
        check('newPassword').not().isEmpty().withMessage('новый пароль не задан').
        isLength({min:6, max: 24}).withMessage('пароль должно включать от 6 до 24 символов')
    ],
    authManagerMiddlewaer,
    ManagerControllers.changePassword
);

managerRouter.patch('/email',
    [
        check('newEmail').not().isEmpty().withMessage('Email не задан').
        isEmail().withMessage('Неверный email')
    ],
    authManagerMiddlewaer,
    ManagerControllers.changeEmail
);

managerRouter.delete('/',
    [
        check('password').not().isEmpty().withMessage('пароль не задан')
    ],
    authManagerMiddlewaer,
    ManagerControllers.deleteManager
);

module.exports = managerRouter;