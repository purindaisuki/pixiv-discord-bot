import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { mocked } from "ts-jest/utils";
import { search, searchIllusts, SEARCH_FLAG } from "../../commands/search";
import PixivAPI from "../../pixiv";
import {
  mockIllustsResponse,
  mockInteraction,
  mockInteractionOptions,
} from "../../__mocks__";

jest.mock("../../pixiv", () =>
  jest.fn().mockImplementation(() => ({
    searchLatestIllusts: jest.fn(() => Promise.resolve(mockIllustsResponse)),
    searchPopularIllustsPreview: jest.fn(() =>
      Promise.resolve(mockIllustsResponse)
    ),
  }))
);

const pixiv = mocked(new PixivAPI(""));

beforeEach(() => {
  pixiv.searchLatestIllusts.mockClear();
  pixiv.searchPopularIllustsPreview.mockClear();
});

test("search.data should have the properties of the search slashcommand.", () => {
  const { data } = search;
  const [popularSubCommand, latestSubCommand] = (data as SlashCommandBuilder)
    .options;
  const expectedQueryOption = {
    name: "query",
    description: "search keyword",
    required: true,
  };
  const expectedNumberOption = {
    name: "number",
    description: "return first %number% results",
    required: false,
  };

  expect(data.name).toBe("search");
  expect(data.description).toBe("Search illustrations by a word");

  expect(popularSubCommand).toEqual(
    expect.objectContaining({
      name: "popular",
      description: "Search the most popular illustrations",
    })
  );
  expect(
    (popularSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedQueryOption));
  expect(
    (popularSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedNumberOption));

  expect(latestSubCommand).toEqual(
    expect.objectContaining({
      name: "latest",
      description: "Search the latest illustrations",
    })
  );
  expect(
    (latestSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedQueryOption));
  expect(
    (latestSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedNumberOption));
});

test("search.execute(pixiv, interaction) should call pixiv and discord apis.", async () => {
  mockInteractionOptions.getInteger.mockClear();
  mockInteractionOptions.getSubcommand.mockClear();
  mockInteractionOptions.getSubcommand.mockReturnValueOnce(SEARCH_FLAG.POPULAR);
  mockInteractionOptions.getString.mockClear();

  const { execute } = search;

  await execute(pixiv, mockInteraction);

  expect(mockInteraction.options.getInteger).toBeCalledTimes(1);
  expect(mockInteraction.options.getInteger).toBeCalledWith("number");
  expect(mockInteraction.options.getSubcommand).toBeCalledTimes(1);
  expect(mockInteraction.options.getSubcommand).toBeCalledWith();
  expect(mockInteraction.options.getString).toBeCalledTimes(1);
  expect(mockInteraction.options.getString).toBeCalledWith("query", true);

  expect(pixiv.searchPopularIllustsPreview).toBeCalledTimes(1);
});

describe("searchIllusts", () => {
  describe("called with subcommand 'popular'", () => {
    test("should return null when erros happened in pixiv api call.", async () => {
      pixiv.searchPopularIllustsPreview.mockRejectedValueOnce("");

      const illusts = await searchIllusts(pixiv, SEARCH_FLAG.POPULAR, "123", 6);

      expect(illusts).toBe(null);
    });

    test("should return a array with length 6 when the number argument is 6.", async () => {
      const illusts = await searchIllusts(pixiv, SEARCH_FLAG.POPULAR, "123", 6);

      expect(illusts).toBeInstanceOf(Array);
      expect(illusts).toHaveLength(6);
    });

    test("should return a array whose entries should have the properties of type ParsedIllustData.", async () => {
      const illusts = await searchIllusts(pixiv, SEARCH_FLAG.POPULAR, "123", 1);
      const illust = illusts![0];

      expect(illust).toHaveProperty("id");
      expect(illust).toHaveProperty("caption");
      expect(illust).toHaveProperty("user.id");
      expect(illust).toHaveProperty("user.name");
      expect(illust).toHaveProperty("user.image");
      expect(illust).toHaveProperty("image");
    });
  });

  describe("called with subcommand 'latest'", () => {
    test("should return null when erros happened in pixiv api call.", async () => {
      pixiv.searchLatestIllusts.mockRejectedValueOnce("");

      const illusts = await searchIllusts(pixiv, SEARCH_FLAG.LATEST, "123", 6);

      expect(illusts).toBe(null);
    });

    test("should return a array with length 6 when the number argument is 6.", async () => {
      const illusts = await searchIllusts(pixiv, SEARCH_FLAG.LATEST, "123", 6);

      expect(illusts).toBeInstanceOf(Array);
      expect(illusts).toHaveLength(6);
    });

    test("should return a array whose entries should have the properties of type ParsedIllustData.", async () => {
      const illusts = await searchIllusts(pixiv, SEARCH_FLAG.LATEST, "123", 1);
      const illust = illusts![0];

      expect(illust).toHaveProperty("id");
      expect(illust).toHaveProperty("caption");
      expect(illust).toHaveProperty("user.id");
      expect(illust).toHaveProperty("user.name");
      expect(illust).toHaveProperty("user.image");
      expect(illust).toHaveProperty("image");
    });
  });
});
