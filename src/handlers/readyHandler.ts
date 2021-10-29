import { GuildManager } from "discord.js";
import { commandsCollection } from "../commands";
import config from "../config";

export const getReadyHandler = (guilds: GuildManager) => () => {
  console.log("Bot is ready");

  if (config.nodeEnv === "development") {
    const guild = guilds.cache.get(config.guildId!);
    const commands = guild?.commands;

    commandsCollection.forEach((command) => {
      commands?.create(command.data.toJSON());
    });
  }
};
