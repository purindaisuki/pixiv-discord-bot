import { CommandInteraction } from "discord.js";
import {
  SlashCommandBooleanOption,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { RankingMode } from "../types/enums";
import PixivAPI from "../pixiv";
import {
  DISCORD_EMBED_MAXIMUM,
  handleIllustReply,
  numberOption as number,
  parseIllustsResponse,
} from "./utils";

type ExposedRankingMode =
  | RankingMode.DAY
  | RankingMode.WEEK
  | RankingMode.MONTH;

const fetchRankingIllusts = async (
  pixiv: PixivAPI,
  flag: ExposedRankingMode,
  r18: boolean | null,
  number: number
) => {
  let illusts;
  try {
    let mode;
    if (r18) {
      switch (flag) {
        case RankingMode.DAY:
          mode = RankingMode.DAY_R18;
          break;
        case RankingMode.WEEK:
          mode = RankingMode.WEEK_R18;
          break;
      }
    } else {
      mode = flag;
    }

    illusts = parseIllustsResponse(
      (await pixiv.fetchRankingIllust(mode)).illusts.slice(0, number)
    );
  } catch (err) {
    console.log(err);
  }

  return illusts ?? null;
};

const r18Filter = (option: SlashCommandBooleanOption) =>
  option
    .setName("r18")
    .setDescription("Return NSFW results")
    .setRequired(false);

export const ranking = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Return illustrations by ranking")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("day")
        .setDescription("Return day ranking")
        .addBooleanOption(r18Filter)
        .addIntegerOption(number)
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("week")
        .setDescription("Return week ranking")
        .addBooleanOption(r18Filter)
        .addIntegerOption(number)
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("month")
        .setDescription("Return month ranking")
        .addIntegerOption(number)
    ),
  async execute(pixiv: PixivAPI, interaction: CommandInteraction) {
    const { options } = interaction;
    const number = Math.min(
      options.getInteger("number") ?? 1,
      DISCORD_EMBED_MAXIMUM
    );
    const illusts = await fetchRankingIllusts(
      pixiv,
      options.getSubcommand() as ExposedRankingMode,
      options.getBoolean("r18"),
      number
    );

    await handleIllustReply(interaction, illusts);
  },
};
