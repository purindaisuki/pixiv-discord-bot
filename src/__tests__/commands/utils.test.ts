import { SearchIllustsResponse } from "../../types/response";
import {
  handleIllustReply,
  parseIllustsResponse,
  illustEmbed,
} from "../../commands/utils";
import { mockIllust, mockInteraction } from "../../__mocks__";

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

describe("handleIllustReply(interaction, promise)", () => {
  beforeEach(() => {
    mockInteraction.deferReply.mockClear();
    mockInteraction.editReply.mockClear();
  });

  test("should call interaction.deferReply and throw Error when resolved illusts is null.", async () => {
    await expect(
      handleIllustReply(mockInteraction, Promise.resolve(null))
    ).rejects.toThrow("Errors happened when fetching data");

    expect(mockInteraction.deferReply).toBeCalledTimes(1);
  });

  test("should call interaction.deferReply and interation.editReply with 'Not found' when resolved illusts has no entries.", async () => {
    await handleIllustReply(mockInteraction, Promise.resolve([]));

    expect(mockInteraction.deferReply).toBeCalledTimes(1);
    expect(mockInteraction.editReply).toBeCalledTimes(1);
    expect(mockInteraction.editReply).toBeCalledWith({
      content: "Not found",
    });
  });

  test("should call interaction.deferReply and interation.editReply with embeds when resolved illusts is an valid array", async () => {
    await handleIllustReply(mockInteraction, Promise.resolve(parsedIllusts));

    expect(mockInteraction.deferReply).toBeCalledTimes(1);
    expect(mockInteraction.editReply).toBeCalledTimes(1);
    expect(mockInteraction.editReply).toBeCalledWith({
      embeds: parsedIllusts.map((illust) => illustEmbed(illust)),
    });
  });
});
