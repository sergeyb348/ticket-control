const multer = require('multer')
const moment = require('moment')
const log4js = require('log4js')
const logger = log4js.getLogger()

const storage = multer.diskStorage({
    destination(req, file, next){
        next(null, 'uploads')
    },
    filename(req, file, next){
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        logger.info(date)
        next(null,`${date}-${file.originalname}`)
    }
})

const fileFilter = (req, file, next) => {
    logger.info(file.mimetype)
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
        next(null, true)
    else
        next(null, false)
}

module.exports = multer({
    storage: storage,
    fileFilter
})