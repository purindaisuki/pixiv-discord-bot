import { Message, MessageEmbed } from "discord.js";
import config from "../config";

export const messageHandler = async (message: Message) => {
  if (message.content.startsWith(`${config.prefix}help`)) {
    const embed = new MessageEmbed()
      .setTitle("HOW-TO")
      .setColor("#0097FA")
      .setDescription(
        "Type `/` in message bar to interact with me.\nMore info: https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ"
      );

    await message.channel.send({ embeds: [embed] });
  }
};
