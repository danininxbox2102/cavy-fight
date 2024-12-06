// Роутер аутентификации


import {parse, validate} from "@telegram-apps/init-data-node";
import express from "express";
import {apiSecret, bot_token, jwtSecret} from "../secret.js";
import jwt from "jsonwebtoken";
import {cavyBackDB} from "../main.js";

export const authRouter = express.Router();


export const verifyToken = (token) => {
    const result = {}

    try {
        const decoded = jwt.verify(token, jwtSecret);
        result.valid = true;
        result.data = decoded;
    } catch (e){
        //console.log("error: "+e.toString())
        if (e.toString() === "TokenExpiredError: jwt expired") result.error = "expired";
        if (e.toString() === "JsonWebTokenError: jwt malformed") result.error = "malformed";
        result.valid = false;
    }

    return result;
}

export const createToken = (userId, type) => {
    switch (type) {
        case "access_token":
            return jwt.sign(
                {
                    token_type: "access_token",
                    id: userId,
                },
                jwtSecret,
                {expiresIn: '15m'}
            );
        case "refresh_token":
            return jwt.sign(
                {
                    token_type: "refresh_token",
                    id: userId,
                },
                jwtSecret,
                {expiresIn: '7d'}
            );
        case "file_token":
            return jwt.sign({
                token_type: "file_token",
                id: userId
            }, apiSecret, { expiresIn: '1h' });
        default:return null;
    }
}

export const verifyTMA = (req) => {
    const [authType, authData = ""] = (req.header("authorization") || "").split(" ");
    const result = {}

    if (authType !== "tma") {
        result.valid = false;
        result.error = "ERR_TMA_REQUIRED";
        return result;
    }

    try {
        validate(authData, bot_token, {
            expiresIn: 900*1000, // remove *1000
        });

        result.valid = true;
        result.data = parse(authData);
    } catch (e) {
        result.valid = false;
        result.error = e.type;
    }

    return result;
}

// Эндпоинт для получения JWT
authRouter.get("/tma", async (req, res) => {
    const result = verifyTMA(req)

    if (!result.valid && !result.error) {
        res.status(500);
        res.json({
            error: "Server error",
        });
        return
    }

    if (!result.valid && result.error){
        res.status(401);
        res.json({
            error: result.error,
        });
        return
    }

    const data = result.data;

    const userId = data.user.id;

    const refreshToken = createToken(userId, "refresh_token");
    const accessToken = createToken(userId, "access_token");

    const account = await cavyBackDB.getAccount(userId)

    if (!account) {
        console.log("Creating new account for user: "+userId)
        res.redirect("https://starlightmc.site:3000/new/profile");
        return
    }

    account.refresh_token = refreshToken;
    account.ip_history.push({date: Date.now(), ip: req.socket.remoteAddress});

    cavyBackDB.updateAccount(userId, account).then(result => {
        res.status(200);
        res.json({
            refreshToken: refreshToken,
            accessToken: accessToken
        });
    }).catch(e => {
        res.status(500);
        res.json({
            error: e,
        });
    })

})



// Эндпоинт для обновления Access token по Refresh token
authRouter.post("/token/refresh/", async (req, res) => {
    if (!req.body) {
        res.status(400);
        res.json({
            error: "Wrong request",
        })
        return;
    }

    const data = req.body;

    if (!data.refreshToken) {
        res.status(400);
        res.json({
            error: "Refresh token required!",
        })
        return;
    }

    const result = verifyToken(data.refreshToken);

    const RTInvalid = "Invalid Refresh Token" // Ты АБЯЗАН использовать только это сообщение о ошибке

    if (!result.valid) {

        if (result.error) {
            res.status(401);
            res.json({
                error: result.error,
            });
            return;
        }

        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return;
    }

    if (result.data.token_type !== "refresh_token") {
        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return;
    }



    const id = Number.parseInt(result.data.id);

    if (isNaN(id)) {
        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return;
    }

    const account = await cavyBackDB.getAccount(id)

    if (!account) {
        res.status(404);
        res.json({
            error: RTInvalid,
        });
        return
    }

    if (account.refresh_token !== data.refreshToken) {
        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return
    }

    const accessToken = createToken(id, "access_token");

    res.status(200);
    res.json({
        accessToken: accessToken
    });
})



// Эндпоинт для обновления Refresh token по Refresh token
authRouter.get("/token/refresh/refresh/", async (req, res) => {

    if (!req.body) {
        res.status(400);
        res.json({
            error: "Wrong request",
        })
        return;
    }

    const data = req.body;


    if (!data.userId) {
        res.status(400);
        res.json({
            error: "Wrong request",
        })
        return;
    }

    if (authType !== "jwt" || authData === "") {
        res.status(401);
        res.json({
            error: "JWT Token required",
        });
        return;
    }

    const result = verifyToken(authData);

    const RTInvalid = "Invalid Refresh Token" // Ты АБЯЗАН использовать только это сообщение о ошибке

    if (!result.valid) {

        if (result.error === "expired") {
            res.status(401);
            res.json({
                error: "expired",
            });
            return;
        }

        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return;
    }

    if (result.type !== "refresh_token") {
        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return;
    }

    const id = Number.parseInt(req.params.id);

    const account = await cavyBackDB.getAccount(id)

    if (!account) {
        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return
    }

    if (account.refresh_token !== authData) {
        res.status(401);
        res.json({
            error: RTInvalid,
        });
        return
    }

    const refreshToken = createToken(id, "refresh_token");

    res.status(200);
    res.json({
        refreshToken: refreshToken
    });
})