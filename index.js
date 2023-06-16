const express = require("express");
const router = require("./routes/index");
const errorHandling = require('./middlewaer/errorHandlingMiddlewaer');
const dbSequelize = require('./db');
const log4js = require("log4js");
const cors = require('cors')
const cookieParser = require('cookie-parser')

var logger = log4js.getLogger();
logger.level = 'debug';

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());


logger.info(process.env.CLIENT_URL)

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))




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
