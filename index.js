const express = require("express");
const router = require("./routes/index");
const errorHandling = require('./middlewaer/errorHandlingMiddlewaer');
const dbSequelize = require('./db');
const log4js = require("log4js");

require("dotenv").config();

const app = express();

app.use(express.json());

var logger = log4js.getLogger();
logger.level = "debug";
app.use('/api', router)


app.use(errorHandling);

app.listen(process.env.PORT, (error) => {
    if(error){
        logger.error(error);
    }
    else
        logger.debug("Server started Port: " + process.env.PORT);
        try{
            dbSequelize.authenticate();
            dbSequelize.sync();
            logger.debug('db connection success')
        }
        catch (error){
            logger.error(error);
        }
    }
);
