import { Telegraf, Markup } from "telegraf";
import ngrok from "ngrok";

import { webserver } from "./webserver.js";
import { dbConnect } from "./database.js";
import { bot_token, ngrok_token } from "./secret.js";

//console.log("starting ngrok...");

//await ngrok.authtoken(ngrok_token);
//const appUrl = await ngrok.connect(5173);

//console.log("tunnel set up at url: " + appUrl);

const bot = new Telegraf(bot_token);

// bot.on("message", async (ctx) => {
//   try {
//     await ctx.reply("Ваше сообщение");
//   } catch (error) {
//     if (error.code === 403) {
//       console.error("Бот был исключён из группы:", error.description);
//     } else {
//       console.error("Ошибка:", error);
//     }
//   }
// });

// bot.command("start", (ctx) => {
//   try {
//     ctx.replyWithHTML(
//       "Ку, хай! Чтобы начать играть нажми <b>Запустить Cavy Fight</b>",
//       Markup.keyboard([Markup.button.webApp("Запустить Cavy Fight", appUrl)])
//     );
//   } catch (e) {
//     console.log("Error: ", e);
//   }
// });

dbConnect();

bot.launch();
console.log("Бот запущен!");

webserver.listen(3000);
console.log("HTTP сервер запущен!");
