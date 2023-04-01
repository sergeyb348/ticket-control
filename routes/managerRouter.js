const { Router } = require("express");
const ManagerControllers = require('../controllers/managerControllers')
const authMiddlewaer = require('../middlewaer/authMiddlewaer')

const managerRouter = new Router();


managerRouter.post('/registration', ManagerControllers.registration);
managerRouter.post('/login', ManagerControllers.login);
managerRouter.get('/auth',authMiddlewaer, ManagerControllers.auth);
managerRouter.patch('/name',authMiddlewaer, ManagerControllers.changeName);
managerRouter.patch('/password',authMiddlewaer, ManagerControllers.changePassword);
managerRouter.delete('/',authMiddlewaer, ManagerControllers.deleteManager);

module.exports = managerRouter;