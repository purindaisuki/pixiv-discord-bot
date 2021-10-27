import { Interaction } from "discord.js";
import { commandsCollection } from "../commands";
import PixivAPI from "../pixiv";

export const getInteractionHandler =
  (pixiv: PixivAPI) => async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = commandsCollection.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(pixiv, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Error", ephemeral: true });
    }
  };
