import {parse, validate} from "@telegram-apps/init-data-node";
import {bot_token, jwtSecret} from "../secret.js";
import jwt from "jsonwebtoken";
import express from "express";
import {createAccount, getAccount, updateAccount} from "../CavyBackDatabase.js";
import {getTgUserPhoto} from "../cavyBackUtils.js";
import {CavyBackDatabase} from "../../CavyBackDatabase.js";

/**
 * Sets init data in the specified Response object.
 * @param res - Response object.
 * @param data - init data.
 */
function setLocalData(res, data) {
    res.locals.data = data;
}

/**
 * Extracts init data from the Response object.
 * @param res - Response object.
 * @returns Init data stored in the Response object. Can return undefined in case,
 * the client is not authorized.
 */
function getLocalData(res) {
    return res.locals.data;
}

/**
 * Middleware which authorizes the external client.
 * @param req - Request object.
 * @param res - Response object.
 * @param next - function to call the next middleware.
 */
const authMiddleware = (req, res, next) => {
    // We expect passing init data in the Authorization header in the following format:
    // <auth-type> <auth-data>
    // <auth-type> must be "tma", and <auth-data> is Telegram Mini Apps init data.
    const [authType, authData = ""] = (req.header("authorization") || "").split(
        " "
    );

    switch (authType) {
        case "tma":
            try {
                // Validate init data.
                validate(authData, bot_token, {
                    expiresIn: 30000,
                });

                // Parse init data. We will surely need it in the future.

                const data = parse(authData);
                // @ts-ignore
                data.authType = "tma";
                setLocalData(res, data);
                return next();
            } catch (e) {
                return next(e);
            }
        case "jwt":
            try {
                const data = jwt.verify(authData, jwtSecret);
                // @ts-ignore
                data.authType = "jwt";
                setLocalData(res, data);
                return next();
            } catch (e) {
                return next(e);
            }
        default:
            return next(new Error("Unauthorized"));
    }
};

/**
 * Middleware which displays the user init data.
 * @param err - handled error.
 * @param _req
 * @param res - Response object.
 */
const defaultErrorMiddleware = (err, _req, res, next) => {
    console.log(
        "error: " + _req.socket.remoteAddress + " " + JSON.stringify(err)
    ); // Для отладки
    res.status(500);
    res.json({
        error: err.message, // Отправляем только сообщение ошибки
    });
};







export const mainRouter = express.Router();
mainRouter.use(authMiddleware)

mainRouter.get("/auth", (_req, res, next) => {
    const initData = getLocalData(res);

    const token = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // Новый токен действителен 1 час
            id: initData.user.id,
        },
        jwtSecret
    );

    res.status(200);
    res.json({
        token: token,
    });
});

mainRouter.post("/auth/refresh", (_req, res, next) => {
    const initData = getLocalData(res);

    const token = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            id: initData.user.id,
        },
        jwtSecret
    );

    res.status(200);
    res.json({
        token: token,
    });
});


// mainRouter.get("/profile/:id", async (_req, res, next) => {
//     let profile_id = Number.parseInt(_req.params.id);
//
//     const loginData = getLocalData(res);
//
//     if (loginData.authType === "tma") {
//         res.status(400);
//         res.json({
//             error: "tma auth is not supported. use jwt instead",
//         });
//         return;
//     }
//
//     let found_account = await getAccount(profile_id);
//
//     if (!found_account) {
//         res.status(404);
//         res.json({
//             error: "profile not found",
//         });
//         return;
//     }
//
//     if (loginData.id === profile_id) {
//         res.status(200);
//         res.json({
//             profile: found_account,
//         });
//         return;
//     }
//
//     res.status(200);
//     res.json({
//         profile: {
//             _id: found_account._id,
//             first_name: found_account.first_name,
//         },
//     });
// });

const getTgUserProfile = () => {

}

// mainRouter.post("/new_profile", async (_req, res, next) => {
//     const loginData = getLocalData(res);
//
//     if (loginData.authType === "tma") {
//         res.status(400);
//         res.json({
//             error: "tma auth is not supported. use jwt instead",
//         });
//         return;
//     }
//
//     const id = Number.parseInt(loginData.id);
//     const initData = _req.header("initData");
//
//     if (!initData) {
//         res.status(400);
//         res.json({
//             error: "init data required",
//         });
//         return;
//     }
//
//     let data;
//
//     try {
//         // @ts-ignore
//         validate(initData, bot_token, {
//             expiresIn: 3600,
//         });
//
//         data = parse(initData);
//     } catch (e) {
//         res.status(403);
//         res.json({
//             error: e.type,
//         });
//         return;
//     }
//
//     const found_account = await getAccount(id);
//
//     if (found_account) {
//         res.status(409);
//         res.json({
//             error: "profile already exists",
//         });
//         return;
//     }
//
//     const ip_address = _req.socket.remoteAddress
//
//     await createAccount(id);
//
//     let account_data = {
//         first_name: data.user.firstName,
//         last_name: data.user.lastName,
//         username: data.user.username,
//         registration_ip_address: ip_address,
//         ip_history: [ip_address]
//     };
//
//     await updateAccount(id, account_data);
//
//     res.status(200);
//     res.json({
//         response: "profile created",
//     });
// });

// mainRouter.post("/sync_data", async (_req, res, next) => {
//     const loginData = getLocalData(res);
//
//     if (loginData.authType === "tma") {
//         res.status(400);
//         res.json({
//             error: "tma auth is not supported. use jwt instead",
//         });
//         return;
//     }
//
//     let data = _req.body;
//
//     if (!_req.body) {
//         res.status(400);
//         res.json({
//             error: "wrong request! data is required",
//         })
//     }
//
//     const coinsToSync = Number.parseInt(data.coins);
//
//     if (!coinsToSync) {
//         res.status(400);
//         res.json({
//             error: "wrong request! data parameter 'coins' is invalid",
//         });
//         return;
//     }
//
//     const id = Number.parseInt(loginData.id);
//     let found_account = await getAccount(id);
//
//     if (!found_account) {
//         res.status(404);
//         res.json({
//             error: "profile not found",
//         });
//         return;
//     }
//
//     found_account.coins = coinsToSync;
//
//     await updateAccount(id, found_account);
//
//     res.status(200);
//     res.json({
//         status: "success",
//     });
// });

// mainRouter.get("/api/getUserProfilePhoto/:id", async (_req, res, next) => {
//     const loginData = getLocalData(res);
//     if (loginData.authType === "tma") {
//         res.status(400);
//         res.json({
//             error: "tma auth is not supported. use jwt instead",
//         });
//         return;
//     }
//     let profile_id = Number.parseInt(_req.params.id);
//     const data = await getTgUserPhoto(profile_id);
//
//     if (!data) {
//         res.status(500);
//         res.json({
//             status: "failed to get tg user photo",
//         });
//     }
//
//     let buff = Buffer.from(data, 'utf-8');
//     let base64data = buff.toString('base64');
//
//     console.log(base64data);
//
//     if (!base64data) {
//         res.status(500);
//         res.json({
//             status: "failed to encode photo",
//         });
//     }
//
//     res.send(data);
// });

mainRouter.use(defaultErrorMiddleware);