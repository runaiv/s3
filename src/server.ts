import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import express from 'express';
import morgan from'morgan'
import api from './routes/api/'
import passport from 'passport'
import bodyParser from 'body-parser'
import cors from 'cors'

require('dotenv').config();

createConnection()
.then(async connection => {
    
    // Create a new express application instance
    const app = express()


    //middlewares
    app.use(cors())
    app.use(bodyParser.json())
    app.use(morgan('tiny'))
    app.use(passport.initialize())
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }))


    //API ENDPOINTS
    app.use('/', api)




    app.listen(3001, () => {
        console.log(`server started at http://localhost:3001`)
        })
})
.catch(error => console.log(error));
