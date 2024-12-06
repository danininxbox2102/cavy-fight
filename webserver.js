
import express from "express";
import cors from "cors";
import * as https from "node:https";
import * as fs from "node:fs";
import {authMiddleware, mainRouter} from "./routers/MainRouter.js";
import {apiRouter} from "./routers/ApiRouter.js";
import {authRouter} from "./routers/AuthRouter.js";
import {creationRouter} from "./routers/CreationRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/new/', creationRouter);
app.use('/auth/', authRouter);
app.use('/api/', apiRouter);
app.use('/',authMiddleware, mainRouter);


// ssl

const privateKey = fs.readFileSync('./certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./certs/cert.pem', 'utf8');

const options = {
    key: privateKey,
    cert: certificate
};

export const webserver = https.createServer(options, app);