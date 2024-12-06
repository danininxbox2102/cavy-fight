// Middleware для получения API JWT токена
import express from "express";
import {apiSecret} from "../secret.js";
import * as path from "node:path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public/");

//

const apiAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, apiSecret, (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Invalid token' });
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Token is required' });
    }
};

// Создаем роутер для эндпоинтов `/api/image`
export const imageRouter = express.Router();


// Эндпоинт для получения API JWT ключа
imageRouter.get('/getApiKey', (req, res) => {
    const token = jwt.sign({
        token_type: "",
        user: 'user'

    }, apiSecret, { expiresIn: '1h' });
    res.json({ token });
});

// Применяем middleware для получения API JWT токена к роутеру
imageRouter.use(apiAuthMiddleware);


// Эндпоинт для получения изображения
imageRouter.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(publicDir, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Image not found');
        }
        res.sendFile(filePath);
    });
});