const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    if(req.method === "OPTIONS"){
        console.log("ssssssssssssssssssssssssssss" + "OPTIONS")
        next()
    }
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({message: "Не авторизован"});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.manager = decoded;
        next()
    }
    catch(error){
        return res.status(401).json({message: "Не авторизован"});
    }
}