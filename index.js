const express = require("express");
const router = require("./routes/index");
const errorHandling = require('./middlewaer/errorHandlingMiddlewaer');
const dbSequelize = require('./db')
const models = require('./models/Model')

require("dotenv").config();

const app = express();

app.use(express.json());

app.use('/api', router)

app.get('/', (req, res) =>{
    res.send("12 Hello world!")
});

app.use(errorHandling);

app.listen(process.env.PORT, (error) => {
    if(error){
        console.log(error);
    }
    else
        console.log("Server started Port: " + process.env.PORT);
        try{
            dbSequelize.authenticate();
            dbSequelize.sync();
            console.log('db connection success')
        }
        catch (error){
            console.log(error);
        }
    }
);
