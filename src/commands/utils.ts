import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandIntegerOption } from "@discordjs/builders";
import he from "he";
import type {
  ParsedIllustData,
  SearchIllustsResponse,
} from "../types/response";
import config from "../config";

export const DISCORD_EMBED_MAXIMUM = 10; // data.embeds: Must be 10 or fewer in length.
const EMBED_ILLUST_BASE_URL = "https://embed.pixiv.net/decorate.php?illust_id=";

const getProxiedImageURL = (url: string) =>
  config.nodeEnv === "development" || !config.proxy
    ? url.includes("user")
      ? null
      : EMBED_ILLUST_BASE_URL + url.split("/").slice(-1)[0].slice(0, 8)
    : `${config.proxy}/image/${url.replace("https://", "")}`;

const parseDescriptionHtml = (string: string) =>
  he
    .decode(string)
    .replaceAll(/<a[^>]*href="([^"]+)"[^>]*>(?:.*?<\/a>)?/g, "[$1]($1)")
    .replaceAll(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replaceAll("<br />", "\n");

export const parseIllustsResponse = (
  illusts: SearchIllustsResponse["illusts"]
): ParsedIllustData[] =>
  illusts.map((i) => ({
    id: i.id,
    caption: parseDescriptionHtml(i.caption),
    title: i.title,
    user: {
      ...i.user,
      image: getProxiedImageURL(i.user.profile_image_urls.medium),
    },
    image: getProxiedImageURL(
      i.meta_single_page.original_image_url ??
        i.meta_pages[0].image_urls.original
    )!,
  }));
const illustEmbed = (illust: ParsedIllustData) => {
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

export const numberOption = (option: SlashCommandIntegerOption) =>
  option
    .setName("number")
    .setDescription("return first %number% results")
    .setRequired(false);

export const handleIllustReply = async (
  interaction: CommandInteraction,
  illusts: ParsedIllustData[] | null
) => {
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
};
