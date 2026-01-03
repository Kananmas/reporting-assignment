import bodyParser from "body-parser";
import express from "express";

import dbInstance from "./connection.js";

const app = express();

app.use(bodyParser.json());


app.listen(8081 , e => {
    if(e) {
         console.log(`error: ${e.message}`);
    }
    else{
        console.log("connected successfully");
    }
});