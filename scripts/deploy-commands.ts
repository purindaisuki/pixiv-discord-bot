import { Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { makeTuple } from "../src/types/helpers";
import * as commandModules from "../src/commands";
import config from "../src/config";

const commands = new Collection(
  Object.values(commandModules).map((command) =>
    makeTuple([command.data.name, command])
  )
);
const rest = new REST({ version: "9" }).setToken(config.botToken!);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.clientId!, config.guildId!),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
