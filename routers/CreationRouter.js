

// Роутер для создания (к примеру аккаунта или клана)


import express from "express";
import {createToken, verifyTMA} from "./AuthRouter.js";
import {cavyBackDB} from "../main.js";

export const creationRouter = express.Router();

creationRouter.get("/profile", async (_req, res, next) => {
    const result = verifyTMA(_req)

    console.log("aaa")

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

    const found_account = await cavyBackDB.getAccount(userId);

    if (found_account) {
        res.status(409);
        res.json({
            error: "profile already exists",
        });
        return;
    }

    const ip_address = _req.socket.remoteAddress

    await cavyBackDB.createAccount(userId);

    const refreshToken = createToken(null, "refresh_token");
    const accessToken = createToken(userId, "access_token");

    let account_data = {
        first_name: data.user.firstName,
        last_name: data.user.lastName,
        username: data.user.username,
        registration_ip_address: ip_address,
        ip_history: [ip_address],
        refresh_token: refreshToken,
        seenIntro: false,
    };

    await cavyBackDB.updateAccount(userId, account_data);

    res.status(201);
    res.json({
        refreshToken: refreshToken,
        accessToken: accessToken
    });
});