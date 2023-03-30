const  Router = require("express");
const managerRouter = require('./managerRouter.js')

const router = new Router();

router.use('/manager', managerRouter)

module.exports = router;