import { CommandInteraction } from "discord.js";
import { mocked } from "ts-jest/utils";
import { SearchIllustsResponse } from "../../types/response";
import {
  handleIllustReply,
  parseIllustsResponse,
  illustEmbed,
} from "../../commands/utils";
import { mockIllust } from "../../__mocks__/mockIllustsResponse";

const parsedIllusts = parseIllustsResponse([
  mockIllust,
] as SearchIllustsResponse["illusts"]);
const IMAGE_URL =
  "https://i.pximg.net/img-original/img/2018/07/24/20/49/16/69841518_p0.jpg";
const USER_IMAGE_URL =
  "https://i.pximg.net/user-profile/img/2020/06/02/14/06/38/18753751_cd0cf620c750f101ba73e0f0cb57726b_170.jpg";

describe("getProxiedImageUrl(url)", () => {
  describe("at development stage", () => {
    let getProxiedImageUrl: (url: string) => string | null;
    let EMBED_ILLUST_BASE_URL: string;

    beforeEach(() => {
      jest.resetModules();
      process.env.NODE_ENV = "development";

      const {
        getProxiedImageUrl: fn,
        EMBED_ILLUST_BASE_URL: URL,
      } = require("../../commands/utils");
      getProxiedImageUrl = fn;
      EMBED_ILLUST_BASE_URL = URL;
    });

    test("should return an embedded image url when url is an image url.", () => {
      expect(getProxiedImageUrl(IMAGE_URL)).toBe(
        EMBED_ILLUST_BASE_URL + IMAGE_URL.split("/").slice(-1)[0].slice(0, 8)
      );
    });

    test("should return null when url is a user image url.", () => {
      expect(getProxiedImageUrl(USER_IMAGE_URL)).toBe(null);
    });

    afterAll(() => {
      process.env.NODE_ENV = "test";
    });
  });

  describe("at non-development stage and with a proxy", () => {
    const TEST_PROXY = "https://test.proxy";
    let getProxiedImageUrl: (url: string) => string | null;

    beforeEach(() => {
      jest.resetModules();
      process.env.PROXY = TEST_PROXY;

      const { getProxiedImageUrl: fn } = require("../../commands/utils");
      getProxiedImageUrl = fn;
    });

    test("should return a proxied url when url is an image url", () => {
      expect(getProxiedImageUrl(IMAGE_URL)).toBe(
        `${process.env.PROXY}/image/${IMAGE_URL.replace("https://", "")}`
      );
    });

    test("should return a proxied url when url is a user image url", () => {
      expect(getProxiedImageUrl(USER_IMAGE_URL)).toBe(
        `${process.env.PROXY}/image/${USER_IMAGE_URL.replace("https://", "")}`
      );
    });

    afterAll(() => {
      process.env.PROXY = undefined;
    });
  });
});

describe("illustEmbed(illust)", () => {
  test("should have author image when illust.user.image is truthy.", () => {
    const illust = { ...parsedIllusts[0], user: { ...parsedIllusts[0].user } };
    illust.user.image = USER_IMAGE_URL;

    const embed = illustEmbed(illust);

    expect(embed.author?.iconURL).toBe(USER_IMAGE_URL);
  });

  test("should have no author image illust.user.image is falsy", () => {
    const illust = { ...parsedIllusts[0], user: { ...parsedIllusts[0].user } };
    illust.user.image = null;

    const embed = illustEmbed(illust);

    expect(embed.author?.iconURL).toBe(undefined);
  });
});

describe("handleIllustReply(interaction, illusts) should call interation.reply with", () => {
  const mockInteraction = mocked({
    reply: jest.fn() as Partial<CommandInteraction["reply"]>,
  } as CommandInteraction);

  beforeEach(() => {
    mockInteraction.reply.mockClear();
  });

  test("'Error' when illusts is null.", async () => {
    await handleIllustReply(mockInteraction, null);

    expect(mockInteraction.reply).toBeCalledTimes(1);
    expect(mockInteraction.reply).toBeCalledWith({
      content: "Error",
      ephemeral: true,
    });
  });

  test("'Not found' when illusts has no entries.", async () => {
    await handleIllustReply(mockInteraction, []);

    expect(mockInteraction.reply).toBeCalledTimes(1);
    expect(mockInteraction.reply).toBeCalledWith({
      content: "Not found",
    });
  });

  test("embeds when illusts is an valid array", async () => {
    await handleIllustReply(mockInteraction, parsedIllusts);

    expect(mockInteraction.reply).toBeCalledTimes(1);
    expect(mockInteraction.reply).toBeCalledWith({
      embeds: parsedIllusts.map((illust) => illustEmbed(illust)),
    });
  });
});
