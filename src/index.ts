import { Client, Collection, Intents, MessageEmbed } from "discord.js";
import { makeTuple } from "./types/helpers";
import PixivAPI from "./pixiv";
import { listen } from "./server";
import * as commandModules from "./commands";
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

const commandsCollection = new Collection(
  Object.values(commandModules).map((command) =>
    makeTuple([command.data.name, command])
  )
);

bot.on("ready", () => {
  console.log("Bot is ready");

  const guild = bot.guilds.cache.get(config.guildId!);
  const commands = guild?.commands;

  commandsCollection.forEach((command) => {
    commands?.create(command.data.toJSON());
  });
});

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commandsCollection.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(pixiv, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "Error", ephemeral: true });
  }
});

bot.on("message", async (message) => {
  // Check for command
  if (message.content.startsWith(`${config.prefix}help`)) {
    const embed = new MessageEmbed()
      .setTitle("HOW-TO")
      .setColor("#0097FA")
      .setDescription(
        "Type `/` in message bar to interact with me.\nMore info: https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ"
      );

    message.channel.send({ embeds: [embed] });
  }
});

listen();

bot.login(config.botToken);
