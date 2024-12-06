

// Основной роутер


import express from "express";
import {verifyToken} from "./AuthRouter.js";
import {cavyBackDB} from "../main.js";

export const mainRouter = express.Router();

function setLocalData(res, data) {
    res.locals.data = data;
}

function getLocalData(res) {
    return res.locals.data;
}

export const authMiddleware = (_req, res, next) => {
    const [authType, authData = ""] = (_req.header("authorization") || "").split(" ");

    if (authType !== "jwt" || authData === "") {
        res.status(401);
        res.json({
            error: "JWT Token required",
        });
        return;
    }

    const result = verifyToken(authData);

    if (!result.valid && result.error === "malformed") {
        res.status(401);
        res.json({
            error: "JWT Token malformed",
        });
        return;
    }

    if (!result.valid && result.error === "expired") {
        res.status(403);
        res.json({
            error: "Token is expired",
        });
        return;
    }

    if (!result.valid) {
        res.status(401);
        res.json({
            error: "Token is not valid",
        });
        return;
    }

    if (result.data.token_type !== "access_token") {
        res.status(401);
        res.json({
            error: "Access Token required",
        });
        return;
    }

    setLocalData(res, result.data);
    next();
};

mainRouter.get("/profile/:id", async (_req, res, next) => {
    const id = getLocalData(res).id;
    const profile_id = Number.parseInt(_req.params.id);

    console.log("profile_id: "+profile_id)

    const found_account = await cavyBackDB.getAccount(profile_id);

    if (!found_account) {
        res.status(404);
        res.json({
            error: "Profile not found",
        });
        return;
    }

    if (id === profile_id) {
        res.redirect("/profile/")
        return;
    }

    res.status(200);
    res.json({
        profile: {
            _id: found_account._id,
            first_name: found_account.first_name,
        },
    });
});

mainRouter.get("/profile/", async (_req, res, next) => {
    const id = getLocalData(res).id;
    const found_account = await cavyBackDB.getAccount(id);

    if (!found_account) {
        res.status(404);
        res.json({
            error: "Profile not found",
        });
        return;
    }

    const data = {
        _id: found_account._id,
        account_created_at: found_account.account_created_at,
        level: found_account.level,
        xp_points: found_account.xp_points,
        coins: found_account.coins,
        first_name: found_account.first_name,
        last_name: found_account.last_name,
        username: found_account.username,
        seenIntro: found_account.seenIntro
    }

    res.status(200);
    res.json({
        profile: data,
    });
});

mainRouter.post("/sync_data", async (_req, res, next) => {
    const id = getLocalData(res).id;
    let data = _req.body;

    if (!_req.body) {
        res.status(400);
        res.json({
            error: "Wrong request! data is required",
        })
    }

    const coinsToSync = Number.parseInt(data.coins);

    if (!coinsToSync) {
        res.status(400);
        res.json({
            error: "Wrong request! data parameter 'coins' is invalid",
        });
        return;
    }

    let found_account = await cavyBackDB.getAccount(id);

    if (!found_account) {
        res.status(404);
        res.json({
            error: "profile not found",
        });
        return;
    }

    found_account.coins = coinsToSync;

    await cavyBackDB.updateAccount(id, found_account);

    res.status(200);
});

mainRouter.post("/end_intro", async (_req, res, next) => {
    const id = getLocalData(res).id;

    let found_account = await cavyBackDB.getAccount(id);

    if (!found_account) {
        res.status(404);
        res.json({
            error: "profile not found",
        });
        return;
    }

    found_account.coins = coinsToSync;

    await cavyBackDB.updateAccount(id, found_account);

    res.status(200);
});