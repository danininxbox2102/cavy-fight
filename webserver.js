import { validate, parse } from "@telegram-apps/init-data-node";
import express from "express";
import cors from "cors";
import { bot_token, jwtSecret } from "./secret.js";
import { createAccount, getAccount, updateAccount } from "./database.js";
import jwt from "jsonwebtoken";

/**
 * Sets init data in the specified Response object.
 * @param res - Response object.
 * @param initData - init data.
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
 * Middleware which shows the user init data.
 * @param _req
 * @param res - Response object.
 * @param next - function to call the next middleware.
 */
const showInitDataMiddleware = (_req, res, next) => {
  const initData = getLocalData(res);
  if (!initData) {
    return next(
      new Error("Cant display init data as long as it was not found")
    );
  }
  res.json(initData);
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

export const webserver = express();

webserver.use(cors());
webserver.use(express.json());
webserver.use(authMiddleware);
webserver.get("/", showInitDataMiddleware);
webserver.get("/auth", (_req, res, next) => {
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

webserver.get("/profile/:id", async (_req, res, next) => {
  let profile_id = _req.params.id;

  const loginData = getLocalData(res);

  if (loginData.authType == "tma") {
    res.status(400);
    res.json({
      error: "tma auth is not supported. use jwt instead",
    });
    return;
  }

  let found_account = await getAccount(Number.parseInt(profile_id));

  if (!found_account) {
    res.status(404);
    res.json({
      error: "profile not found",
    });
    return;
  }

  if (loginData.id == profile_id) {
    res.status(200);
    res.json({
      profile: found_account,
    });
    return;
  }

  res.status(200);
  res.json({
    profile: {
      _id: found_account._id,
      first_name: found_account.first_name,
    },
  });
  return;
});

webserver.post("/new_profile", async (_req, res, next) => {
  const loginData = getLocalData(res);

  if (loginData.authType == "tma") {
    res.status(400);
    res.json({
      error: "tma auth is not supported. use jwt instead",
    });
    return;
  }

  const id = Number.parseInt(loginData.id);
  const initData = _req.header("initData");

  if (!initData) {
    res.status(400);
    res.json({
      error: "init data required",
    });
    return;
  }

  let data;

  try {
    // @ts-ignore
    validate(initData, bot_token, {
      expiresIn: 3600,
    });

    data = parse(initData);
  } catch (e) {
    res.status(403);
    res.json({
      error: e.type,
    });
    return;
  }

  const found_account = await getAccount(id);

  if (found_account) {
    res.status(409);
    res.json({
      error: "profile already exists",
    });
    return;
  }

  await createAccount(id);

  let account_data = {
    // @ts-ignore
    first_name: data.user.firstName,
    // @ts-ignore
    last_name: data.user.lastName,
    // @ts-ignore
    username: data.user.username,
  };

  await updateAccount(id, account_data);

  res.status(200);
  res.json({
    response: "profile created",
  });
});

webserver.post("/sync_data", (_req, res, next) => {
  const loginData = getLocalData(res);

  if (loginData.authType == "tma") {
    res.status(400);
    res.json({
      error: "tma auth is not supported. use jwt instead",
    });
    return;
  }

  const id = Number.parseInt(loginData.id);
  let data = _req.body;

  console.log("synced coins: " + JSON.stringify(data));

  res.status(200);
  res.json({
    status: "success",
  });
});

webserver.use(defaultErrorMiddleware);
