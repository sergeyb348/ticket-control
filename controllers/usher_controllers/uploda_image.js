const bcrypt = require('bcrypt');
const ApiError = require('../../error/apiError')
const {Event, Usher} = require('../../models/Model');
const { validationResult } = require('express-validator/check');
const log4js = require('log4js')
const generateJWT = require('../generateJWT');

const logger = log4js.getLogger();

const uplodaImage = async (req, res, next) => {
    logger.info('uplodaImage')
        
    logger.info(req.file)
    if(!req.file)
        return next(ApiError.badRequest({
            errors: [
                {
                    value: req.file,
                    msg: "Нету изображения",
                    param: "image",
                    location: "body"
                }
            ]
        }));
    logger.info(req.file.path)

    const usherDb = await Usher.findOne({where:{id:req.usher.id}})


    if(usherDb.imageSrc)
        fs.unlinkSync(usherDb.imageSrc)

    usherDb.imageSrc = req.file.path;
    usherDb.save();
        

    const token = generateJWT(req.usher.id, req.usher.name, req.usher.email);
    return res.json({token})
}

module.exports = uplodaImage