import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import PixivAPI from "../pixiv";
import {
  DISCORD_EMBED_MAXIMUM,
  handleIllustReply,
  numberOption as number,
  parseIllustsResponse,
} from "./utils";

export const fetchRecommendedIllusts = async (
  pixiv: PixivAPI,
  number: number
) => {
  let illusts;

  try {
    illusts = parseIllustsResponse(
      (await pixiv.fetchRecommendedIllusts()).illusts.slice(0, number)
    );
  } catch (err) {
    console.log(err);
  } finally {
    return illusts ?? null;
  }
};

export const recommend = {
  data: new SlashCommandBuilder()
    .setName("recommend")
    .setDescription("Return recommended illustrations")
    .addIntegerOption(number),
  async execute(pixiv: PixivAPI, interaction: CommandInteraction) {
    const number = Math.min(
      interaction.options.getInteger("number") ?? 1,
      DISCORD_EMBED_MAXIMUM
    );

    await handleIllustReply(
      interaction,
      fetchRecommendedIllusts(pixiv, number)
    );
  },
};
