import { CommandInteraction, MessageEmbed } from "discord.js";
import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { SearchIllustsResponse } from "../types/response";
import Pixiv from "../pixiv";
import { Sort } from "enums";

const EMBED_ILLUST_BASE_URL = "https://embed.pixiv.net/decorate.php?illust_id=";

const getProxiedImageURL = (url: string) =>
  process.env.NODE_ENV === "development" || !process.env.PROXY
    ? url.includes("user")
      ? null
      : EMBED_ILLUST_BASE_URL + url.split("/").slice(-1)[0].slice(0, 8)
    : `${process.env.PROXY}/image/${url.replace("https://", "")}`;

type IllustData = {
  id: number;
  caption: string;
  title: string;
  user: {
    id: number;
    name: string;
    account: string;
    image: string | null;
    is_followed: boolean;
  };
  image: string;
};

const parseSearchIllustsResponse = (
  illusts: SearchIllustsResponse["illusts"]
): IllustData[] =>
  illusts.map((i) => ({
    id: i.id,
    caption: i.caption,
    title: i.title,
    user: {
      ...i.user,
      image: getProxiedImageURL(i.user.profile_image_urls.medium),
    },
    image: getProxiedImageURL(i.image_urls.large)!,
  }));

enum SEARCH_FLAG {
  POPULARITY = "popularity",
  LATEST = "latest",
}

const searchIllust = async (
  pixiv: Pixiv,
  flag: SEARCH_FLAG,
  query: string,
  number: number
) => {
  let illusts;

  try {
    const sort =
      flag === SEARCH_FLAG.POPULARITY
        ? Sort.POPULAR_DESC
        : flag === SEARCH_FLAG.LATEST
        ? Sort.DATE_DESC
        : null;

    if (sort) {
      illusts = parseSearchIllustsResponse(
        (await pixiv.searchIllusts(query, sort)).illusts.slice(0, number)
      );
    }
  } catch (err) {
    console.log(err);
  }

  return illusts ?? null;
};

const illustEmbed = (illust: IllustData) => {
  const embed = new MessageEmbed()
    .setColor("#0097FA")
    .setTitle(illust.title)
    .setURL(`https://www.pixiv.net/artworks/${illust.id}`)
    .setDescription(illust.caption)
    .setImage(illust.image);

  if (illust.user.image) {
    embed.setAuthor(
      illust.user.name,
      illust.user.image,
      `https://www.pixiv.net/users/${illust.user.id}`
    );
  } else {
    embed.setAuthor(
      illust.user.name,
      undefined,
      `https://www.pixiv.net/users/${illust.user.id}`
    );
  }

  return embed;
};

const query = (option: SlashCommandStringOption) =>
  option.setName("query").setDescription("search keyword").setRequired(true);

const number = (option: SlashCommandIntegerOption) =>
  option
    .setName("number")
    .setDescription("return first %number% results")
    .setRequired(false);

export const search = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search illustrations by a word")
    .addSubcommand((subCommand) =>
      subCommand
        .setName(SEARCH_FLAG.POPULARITY)
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
  async execute(pixiv: Pixiv, interaction: CommandInteraction) {
    const { options } = interaction;
    // data.embeds: Must be 10 or fewer in length.
    const number = Math.min(options.getInteger("number") ?? 1, 10);
    const illusts = await searchIllust(
      pixiv,
      options.getSubcommand() as SEARCH_FLAG,
      options.getString("query", true),
      number
    );

    if (!illusts) {
      await interaction.reply({
        content: "Error",
        ephemeral: true,
      });
    } else if (illusts.length === 0) {
      await interaction.reply({
        content: "Not found",
      });
    } else {
      const embeds = illusts.map((illust) => illustEmbed(illust));

      await interaction.reply({ embeds });
    }
  },
};
