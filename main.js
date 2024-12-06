import { Telegraf, Markup } from "telegraf";

import { webserver } from "./webserver.js";
import {CavyBackDatabase} from "./CavyBackDatabase.js";
import {bot_token, dbUrl, ngrok_token} from "./secret.js";
import {CavyFightServer} from "./game/CavyFightServer.js";


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

bot.command("start", (ctx) => {
  try {
    let buttons = []
      buttons.push([{text: 'Играть в 1 клик 🐹', web_app: {url: "https://starlightmc.site/"}},]);
      buttons.push([{text: 'Подписаться на канал', url:"https://t.me/cavyfight"},]);
      buttons.push([{text: 'Про наши другие проекты', url:"https://t.me/cavyfight"},]);
    ctx.replyWithMarkdownV2(
      `Привет\\! Добро пожаловать в Cavy Fight 🐹 
Отныне ты — директор криптобиржи\\. 
Какой? Выбирай сам\\. Тапай по экрану, собирай монеты, качай пассивный доход, разрабатывай 
собственную стратегию дохода\\.
Мы в свою очередь оценим это во время листинга токена, даты которого ты узнаешь совсем скоро\\.
Про друзей не забывай — зови их в игру и получайте вместе ещё больше монет\\!
      `,
      Markup.inlineKeyboard(buttons, {})
    );
  } catch (e) {
    console.log("Error: ", e);
  }
});

export const cavyBackDB = new CavyBackDatabase(dbUrl, "CavyFight");
cavyBackDB.connect();

bot.launch();
console.log("Бот запущен!");

const game = new CavyFightServer();
game.initServer();
console.log("Игровой сервер запущен!");

webserver.listen(3000, () => {
  console.log("HTTP сервер запущен!");
});

