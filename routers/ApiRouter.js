

// Роутер для получения файлов и API


import express from "express";
import {apiSecret} from "../secret.js";
import * as path from "node:path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public/");

export const apiRouter = express.Router();

apiRouter.get("/file/:file_token/:file_path", (req, res) => {

})