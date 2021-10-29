import { Client, Intents } from "discord.js";
import PixivAPI from "./pixiv";
import server from "./server";
import {
  getReadyHandler,
  getInteractionHandler,
  messageHandler,
} from "./handlers";
import config from "./config";

const pixiv = new PixivAPI(config.pixivRefreshToken!);
const bot = new Client({
  presence: {
    status: "online",
    activities: [
      {
        name: `${config.prefix}help`,
        type: "LISTENING",
      },
    ],
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.on("ready", getReadyHandler(bot.guilds));
bot.on("interactionCreate", getInteractionHandler(pixiv));
bot.on("message", messageHandler);

bot.login(config.botToken);

server.listen(config.port ?? "3000", () => {
  console.log("Server is ready");
});
