const { Router } = require("express");
const { check } = require('express-validator/check');
const authUsherMiddlewaer = require('../middlewaer/authUsherMiddlewaer');
const authManagerMiddlewaer = require('../middlewaer/authManagerMiddlewaer');
const UsherControllers = require('../controllers/usherControllers')


const usherRouter = new Router();

usherRouter.post('/registration',
    [
        check('firstName').not().isEmpty().withMessage('Имя не задано').
        isLength({max: 50}).withMessage('Имя должно включать до 50 символов'),
        check('lastName').isLength({max: 50}).withMessage('Фамилия должно включать до 50 символов'),
        check('surname').isLength({max: 50}).withMessage('Отчество должно включать до 50 символов'),
        check('email').not().isEmpty().withMessage('Email не задан').
        isEmail().withMessage('Неверный email'),
        check('password').not().isEmpty().withMessage('пароль не задан').
        isLength({min:6, max: 24}).withMessage('пароль должно включать от 6 до 24 символов')
    ],
    authManagerMiddlewaer,
    UsherControllers.registrationUsher
);

usherRouter.delete('/',
    [
        check('usherId').not().isEmpty().withMessage('Id не задан'),
    ],  
    authManagerMiddlewaer,
    UsherControllers.deleteUsher
);

usherRouter.get('/auth', 
    authUsherMiddlewaer,
    UsherControllers.auth
);

usherRouter.post('/login',
    [
        check('email').not().isEmpty().withMessage('Email не задан'),
        check('password').not().isEmpty().withMessage('пароль не задан')
    ],  
    UsherControllers.login
);

module.exports = usherRouter;