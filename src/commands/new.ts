import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import PixivAPI from "../pixiv";
import {
  DISCORD_EMBED_MAXIMUM,
  handleIllustReply,
  numberOption as number,
  parseIllustsResponse,
} from "./utils";

export const fetchLatestIllusts = async (pixiv: PixivAPI, number: number) => {
  let illusts;

  try {
    illusts = parseIllustsResponse(
      (await pixiv.fetchLatestIllusts()).illusts.slice(0, number)
    );
  } catch (err) {
    console.log(err);
  }

  return illusts ?? null;
};

export const latest = {
  data: new SlashCommandBuilder()
    .setName("new")
    .setDescription("Return new illustrations")
    .addIntegerOption(number),
  async execute(pixiv: PixivAPI, interaction: CommandInteraction) {
    const number = Math.min(
      interaction.options.getInteger("number") ?? 1,
      DISCORD_EMBED_MAXIMUM
    );
    const illusts = await fetchLatestIllusts(pixiv, number);

    await handleIllustReply(interaction, illusts);
  },
};
