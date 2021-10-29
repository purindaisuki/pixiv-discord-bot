import { config } from "dotenv";

config();

export default {
  prefix: "$",
  port: process.env.PORT,
  proxy: process.env.PROXY,
  nodeEnv: process.env.NODE_ENV,
  botToken: process.env.BOT_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  pixivRefreshToken: process.env.PIXIV_REFRESH_TOKEN,
};
