const { Router } = require("express");
const ManagerControllers = require('../controllers/managerControllers')
const authMiddlewaer = require('../middlewaer/authMiddlewaer')

const managerRouter = new Router();


managerRouter.post('/registration', ManagerControllers.registration);
managerRouter.post('/login', ManagerControllers.login);
managerRouter.get('/auth',authMiddlewaer, ManagerControllers.auth);

module.exports = managerRouter;