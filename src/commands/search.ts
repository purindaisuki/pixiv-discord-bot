import { CommandInteraction } from "discord.js";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { Sort } from "../types/enums";
import PixivAPI from "../pixiv";
import {
  DISCORD_EMBED_MAXIMUM,
  handleIllustReply,
  numberOption as number,
  parseIllustsResponse,
} from "./utils";

export enum SEARCH_FLAG {
  POPULAR = "popular",
  LATEST = "latest",
}

export const searchIllusts = async (
  pixiv: PixivAPI,
  flag: SEARCH_FLAG,
  query: string,
  number: number
) => {
  let illusts;

  try {
    switch (flag) {
      case SEARCH_FLAG.LATEST:
        illusts = parseIllustsResponse(
          (await pixiv.searchLatestIllusts(query)).illusts.slice(0, number)
        );
        break;
      case SEARCH_FLAG.POPULAR:
        illusts = parseIllustsResponse(
          (await pixiv.searchPopularIllustsPreview(query)).illusts.slice(
            0,
            number
          )
        );
        console.log(illusts);

        break;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return illusts ?? null;
  }
};

const query = (option: SlashCommandStringOption) =>
  option.setName("query").setDescription("search keyword").setRequired(true);

export const search = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search illustrations by a word")
    .addSubcommand((subCommand) =>
      subCommand
        .setName(SEARCH_FLAG.POPULAR)
        .setDescription("Search the most popular illustrations")
        .addStringOption(query)
        .addIntegerOption(number)
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName(SEARCH_FLAG.LATEST)
        .setDescription("Search the latest illustrations")
        .addStringOption(query)
        .addIntegerOption(number)
    ),
  async execute(pixiv: PixivAPI, interaction: CommandInteraction) {
    const { options } = interaction;
    const number = Math.min(
      options.getInteger("number") ?? 1,
      DISCORD_EMBED_MAXIMUM
    );

    await handleIllustReply(
      interaction,
      searchIllusts(
        pixiv,
        options.getSubcommand() as SEARCH_FLAG,
        options.getString("query", true),
        number
      )
    );
  },
};
