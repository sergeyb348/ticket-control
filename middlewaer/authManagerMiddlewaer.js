const jwt = require("jsonwebtoken");
const {Manager} = require("../models/Model")

module.exports = async function(req, res, next){
    if(req.method === "OPTIONS"){
        next()
    }
    try {
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({message: "Не авторизован"});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const managerDb = await Manager.findOne({where: {id: decoded.id}})

        if(!managerDb)
            return res.status(401).json({message: "Не авторизован"});
        req.manager = decoded;
        next()
    }
    catch(error){
        return res.status(401).json({message: "Не авторизован"});
    }
}