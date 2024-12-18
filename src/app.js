import express from "express"
import cors from "cors"
import {API_JSON_LIMIT} from "./constants.js";
import cookieParser from "cookie-parser"

// create APP
const app = express();

// set the configurations for APP
app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}));
app.use(express.json({limit: API_JSON_LIMIT}));
app.use(express.urlencoded({extended: true, limit: API_JSON_LIMIT}))
app.use(express.static("public"));
app.use(cookieParser());

// export APP
export {app}