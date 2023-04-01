const { Router } = require("express");
const ManagerControllers = require('../controllers/managerControllers')
const authManagerMiddlewaer = require('../middlewaer/authManagerMiddlewaer')

const managerRouter = new Router();


managerRouter.post('/registration', ManagerControllers.registration);
managerRouter.post('/login', ManagerControllers.login);
managerRouter.get('/',authManagerMiddlewaer, ManagerControllers.auth);
managerRouter.patch('/name',authManagerMiddlewaer, ManagerControllers.changeName);
managerRouter.patch('/password',authManagerMiddlewaer, ManagerControllers.changePassword);
managerRouter.patch('/email',authManagerMiddlewaer, ManagerControllers.changeEmail);
managerRouter.delete('/',authManagerMiddlewaer, ManagerControllers.deleteManager);

module.exports = managerRouter;