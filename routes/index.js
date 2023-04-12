const  Router = require("express");
const managerRouter = require('./managerRouter.js')
const usherRouter = require('./usherRouter.js')

const router = new Router();

router.use('/manager', managerRouter)
router.use('/usher', usherRouter)


module.exports = router;