import { Client, ClientUser, Message, MessageEmbed } from "discord.js";
import Pixiv from "./pixiv";
import commands from "./help";
import { keepAlive } from "./server";
import globalConfig from "./config";
import { SearchIllustsResponse } from "./types/response";

const EMBED_ILLUST_BASE_URL = "https://embed.pixiv.net/decorate.php?illust_id=";
const PROXY_IMAGE_URL = "https://pixivBot.purindaisuki.repl.co/image/";

const bot = new Client({
  fetchAllMembers: true,
  presence: {
    status: "online",
    activity: {
      name: `${globalConfig.commandPrefix}help`,
      type: "LISTENING",
    },
  },
});
const pixiv = new Pixiv();

const getProxiedImageUrl = (url: string) =>
  process.env.NODE_ENV === "development"
    ? url.includes("img-original")
      ? EMBED_ILLUST_BASE_URL + url.split("/").slice(-1)[0].slice(0, 8)
      : null
    : PROXY_IMAGE_URL + url.replace("https://", "");

export type IllustData = {
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
const parseSearchIllustsResponse = ({
  illusts,
}: SearchIllustsResponse): IllustData[] =>
  illusts.map((i) => ({
    id: i.id,
    caption: i.caption,
    title: i.title,
    user: {
      ...i.user,
      image: getProxiedImageUrl(i.user.profile_image_urls.medium),
    },
    image: getProxiedImageUrl(i.image_urls.large) as string,
  }));

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

enum SEARCH_FLAG {
  POPULAR = "p",
  LATEST = "l",
}
const searchIllust = async (
  message: Message,
  query: string,
  flag: SEARCH_FLAG,
  num = 1
) => {
  const searchMsg = await message.channel.send(`Searching for ${query}`);
  let illusts;

  try {
    switch (flag) {
      case SEARCH_FLAG.POPULAR:
        illusts = parseSearchIllustsResponse(
          await pixiv.searchPopularIllustsPreview(query)
        );
        break;
      case SEARCH_FLAG.LATEST:
      default:
        illusts = parseSearchIllustsResponse(
          await pixiv.searchLatestIllusts(query)
        );
        break;
    }

    if ((illusts as IllustData[]).length === 0) {
      searchMsg.edit("Not found");
      return;
    }

    searchMsg.delete();

    (illusts as IllustData[]).forEach((illust, ind): boolean | void => {
      if (ind >= globalConfig.maxResultNum || ind >= num) {
        return false;
      }

      message.channel.send(illustEmbed(illust));
    });
  } catch (err) {
    console.log(err);
    searchMsg.edit("Errors happened");
  }
};

bot.on("ready", () =>
  console.log(`Logged in as ${(bot.user as ClientUser).tag}.`)
);

bot.on("message", async (message) => {
  // Check for command
  if (message.content.startsWith(globalConfig.commandPrefix)) {
    let args = message.content
      .slice(globalConfig.commandPrefix.length)
      .split(" ");
    let command = args.shift();
    let options = args.filter((arg) =>
      arg.startsWith(globalConfig.optionPrefix)
    );
    let lastArg = args.slice(-1)[0];
    const query = !lastArg?.startsWith(globalConfig.optionPrefix)
      ? lastArg
      : null;

    switch (command) {
      case "s":
        if (!query) {
          message.reply("Please specify a query word.");
          break;
        }

        let flag = (
          options.includes(globalConfig.optionPrefix + "p") ? "p" : "l"
        ) as SEARCH_FLAG;
        let num: number | undefined;

        options.forEach((option) => {
          const parsedOption = parseInt(
            option.slice(globalConfig.optionPrefix.length)
          );
          if (!isNaN(parsedOption)) {
            num = parsedOption;
            return false;
          }
          return true;
        });
        await searchIllust(message, query, flag, num);

        break;
      case "help":
        let embed = new MessageEmbed()
          .setTitle("HELP MENU")
          .setColor("#0097FA");

        if (!query)
          embed.setDescription(
            (Object.keys(commands) as Array<keyof typeof commands>)
              .map(
                (command) =>
                  `\`${command.padEnd(
                    Object.keys(commands).reduce(
                      (a, b) => (b.length > a.length ? b : a),
                      ""
                    ).length
                  )}\` : ${commands[command].description}`
              )
              .join("\n")
          );
        else {
          if (Object.keys(commands).includes(query)) {
            let command = query as keyof typeof commands;

            embed
              .setTitle(`COMMAND - ${command}`)
              .addField("DESCRIPTION", commands[command].description);
            if ((commands[command] as { flags: unknown }).flags) {
              const flagsString = Object.entries(
                (commands[command] as { flags: { [key: string]: string } })
                  .flags
              ).reduce(
                (string, [flag, description]) =>
                  string +
                  `\`${globalConfig.optionPrefix + flag}\` : ${description}\n`,
                ""
              );
              embed.addField("FLAGS", flagsString);
            }
            embed.addField(
              "FORMAT",
              `\`\`\`${globalConfig.commandPrefix}${commands[command].format}\`\`\``
            );
          } else {
            embed
              .setColor("RED")
              .setDescription(
                "This command does not exist. Please use the help command without specifying any commands to list them all."
              );
          }
        }
        message.channel.send(embed);
        break;
    }
  }
});

keepAlive();
bot.login(globalConfig.botToken);
