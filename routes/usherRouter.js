const { Router } = require("express");
const { check } = require('express-validator/check');
const upload = require('../middlewaer/upload')
const authUsherMiddlewaer = require('../middlewaer/authUsherMiddlewaer');
const authManagerMiddlewaer = require('../middlewaer/authManagerMiddlewaer');

const registrationUsher = require('../controllers/usher_controllers/registration_usher')
const uplodaImage = require('../controllers/usher_controllers/uploda_image')
const deleteUsher = require('../controllers/usher_controllers/delete_usher')
const getUsher = require('../controllers/usher_controllers/get_usher')
const auth = require('../controllers/usher_controllers/auth')
const getEvent = require('../controllers/usher_controllers/get_event')
const login = require('../controllers/usher_controllers/login')
const changeEmail = require('../controllers/usher_controllers/change_email')
const changeFirstName = require('../controllers/usher_controllers/change_first_name')
const changeLastName = require('../controllers/usher_controllers/change_last_name')
const changeSurname = require('../controllers/usher_controllers/change_surname')
const changePassword = require('../controllers/usher_controllers/change_password');
const getUsherEvents = require("../controllers/usher_controllers/get_events_usher");
const getTicket = require("../controllers/usher_controllers/get_ticket");


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
    registrationUsher
);

usherRouter.post('/image',
    authUsherMiddlewaer,
    upload.single('image'),
    uplodaImage
);

usherRouter.post('/delete',
    [
        check('usherId').not().isEmpty().withMessage('Id не задан'),
    ],  
    authManagerMiddlewaer,
    deleteUsher
);

usherRouter.get('/manager',
authManagerMiddlewaer,
getUsher
);

usherRouter.get('/auth', 
    authUsherMiddlewaer,
    auth
);

usherRouter.get('/event', 
    authUsherMiddlewaer,
    getEvent
);

usherRouter.post('/login',
    [
        check('email').not().isEmpty().withMessage('Email не задан'),
        check('password').not().isEmpty().withMessage('пароль не задан')
    ],  
    login
);

usherRouter.patch('/email',
    [
        check('email').not().isEmpty().withMessage('Email не задан').
        isEmail().withMessage('Неверный email')
    ],
    authUsherMiddlewaer,
    changeEmail
);

usherRouter.patch('/firstName',
    [
        check('firstName').not().isEmpty().withMessage('Имя не задано').
        isLength({max: 50}).withMessage('Имя должно включать до 50 символов')
    ],
    authUsherMiddlewaer,
    changeFirstName
);

usherRouter.patch('/lastName',
    [
        check('lastName').not().isEmpty().withMessage('Имя не задано').
        isLength({max: 50}).withMessage('Имя должно включать до 50 символов')
    ],
    authUsherMiddlewaer,
    changeLastName
);

usherRouter.patch('/surname',
    [
        check('surname').not().isEmpty().withMessage('Имя не задано').
        isLength({max: 50}).withMessage('Имя должно включать до 50 символов')
    ],
    authUsherMiddlewaer,
    changeSurname
);

usherRouter.patch('/password',
    [
        check('password').not().isEmpty().withMessage('пароль не задан'),
        check('newPassword').not().isEmpty().withMessage('новый пароль не задан').
        isLength({min:6, max: 24}).withMessage('пароль должно включать от 6 до 24 символов')
    ],
    authUsherMiddlewaer,
    changePassword
);

usherRouter.post('/event/get',
    authUsherMiddlewaer,
    getUsherEvents

)

usherRouter.post('/getTicket',
    authUsherMiddlewaer,
    getTicket

)

module.exports = usherRouter;