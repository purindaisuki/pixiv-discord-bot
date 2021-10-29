import { CommandInteraction } from "discord.js";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { mocked } from "ts-jest/utils";
import { RankingMode } from "../../types/enums";
import { ranking, fetchRankingIllusts } from "../../commands/ranking";
import PixivAPI from "../../pixiv";
import mockIllustsResponse from "../../__mocks__/mockIllustsResponse";

jest.mock("../../pixiv", () =>
  jest.fn().mockImplementation(() => ({
    fetchRankingIllusts: jest.fn(() => Promise.resolve(mockIllustsResponse)),
  }))
);

const pixiv = mocked(new PixivAPI(""));

beforeEach(() => {
  pixiv.fetchRankingIllusts.mockClear();
});

test("ranking.data should have the properties of the rank slashcommand.", () => {
  const { data } = ranking;
  const [daySubCommand, weekSubCommand, monthSubCommand] = (
    data as SlashCommandBuilder
  ).options;
  const expectedR18Option = {
    name: "r18",
    description: "Return NSFW results",
    required: false,
  };
  const expectedNumberOption = {
    name: "number",
    description: "return first %number% results",
    required: false,
  };

  expect(data.name).toBe("rank");
  expect(data.description).toBe("Return illustrations by ranking");

  expect(daySubCommand).toEqual(
    expect.objectContaining({
      name: "day",
      description: "Return day ranking",
    })
  );
  expect(
    (daySubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedR18Option));
  expect(
    (daySubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedNumberOption));

  expect(weekSubCommand).toEqual(
    expect.objectContaining({
      name: "week",
      description: "Return week ranking",
    })
  );
  expect(
    (weekSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedR18Option));
  expect(
    (weekSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedNumberOption));

  expect(monthSubCommand).toEqual(
    expect.objectContaining({
      name: "month",
      description: "Return month ranking",
    })
  );
  expect(
    (monthSubCommand as SlashCommandSubcommandBuilder).options
  ).toContainEqual(expect.objectContaining(expectedNumberOption));
});

test("ranking.execute(pixiv, interaction) should call pixiv and discord apis.", async () => {
  const { execute } = ranking;
  const mockInteraction = {
    reply: jest.fn() as Partial<CommandInteraction["reply"]>,
    options: {
      getBoolean: jest.fn(),
      getInteger: jest.fn(),
      getSubcommand: jest.fn(),
    } as Partial<CommandInteraction["options"]>,
  } as CommandInteraction;

  await execute(pixiv, mockInteraction);

  expect(mockInteraction.options.getInteger).toBeCalledTimes(1);
  expect(mockInteraction.options.getInteger).toBeCalledWith("number");
  expect(mockInteraction.options.getSubcommand).toBeCalledTimes(1);
  expect(mockInteraction.options.getSubcommand).toBeCalledWith();
  expect(mockInteraction.options.getBoolean).toBeCalledTimes(1);
  expect(mockInteraction.options.getBoolean).toBeCalledWith("r18");

  expect(pixiv.fetchRankingIllusts).toBeCalledTimes(1);
});

describe("fetchRankingIllusts", () => {
  describe("called with subcommand 'day'", () => {
    test("should return null when erros happened in pixiv api call.", async () => {
      pixiv.fetchRankingIllusts.mockRejectedValueOnce("");

      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.DAY,
        false,
        6
      );

      expect(illusts).toBe(null);
    });

    test("should return a array with length 6 when the number argument is 6.", async () => {
      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.DAY,
        false,
        6
      );

      expect(illusts).toBeInstanceOf(Array);
      expect(illusts).toHaveLength(6);
    });

    describe("should return a array whose entries should have the properties of type ParsedIllustData", () => {
      test("without r18 tag.", async () => {
        const illusts = await fetchRankingIllusts(
          pixiv,
          RankingMode.DAY,
          false,
          1
        );
        const illust = illusts![0];

        expect(illust).toHaveProperty("id");
        expect(illust).toHaveProperty("caption");
        expect(illust).toHaveProperty("user.id");
        expect(illust).toHaveProperty("user.name");
        expect(illust).toHaveProperty("user.image");
        expect(illust).toHaveProperty("image");
      });
    });

    test("with r18 tag.", async () => {
      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.DAY,
        true,
        1
      );
      const illust = illusts![0];

      expect(illust).toHaveProperty("id");
      expect(illust).toHaveProperty("caption");
      expect(illust).toHaveProperty("user.id");
      expect(illust).toHaveProperty("user.name");
      expect(illust).toHaveProperty("user.image");
      expect(illust).toHaveProperty("image");
    });
  });

  describe("called with subcommand 'week'", () => {
    test("should return null when erros happened in pixiv api call.", async () => {
      pixiv.fetchRankingIllusts.mockRejectedValueOnce("");

      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.WEEK,
        false,
        6
      );

      expect(illusts).toBe(null);
    });

    test("should return a array with length 6 when the number argument is 6.", async () => {
      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.WEEK,
        false,
        6
      );

      expect(illusts).toBeInstanceOf(Array);
      expect(illusts).toHaveLength(6);
    });

    describe("should return a array whose entries should have the properties of type ParsedIllustData", () => {
      test("without r18 tag.", async () => {
        const illusts = await fetchRankingIllusts(
          pixiv,
          RankingMode.WEEK,
          false,
          1
        );
        const illust = illusts![0];

        expect(illust).toHaveProperty("id");
        expect(illust).toHaveProperty("caption");
        expect(illust).toHaveProperty("user.id");
        expect(illust).toHaveProperty("user.name");
        expect(illust).toHaveProperty("user.image");
        expect(illust).toHaveProperty("image");
      });
    });

    test("with r18 tag.", async () => {
      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.WEEK,
        true,
        1
      );
      const illust = illusts![0];

      expect(illust).toHaveProperty("id");
      expect(illust).toHaveProperty("caption");
      expect(illust).toHaveProperty("user.id");
      expect(illust).toHaveProperty("user.name");
      expect(illust).toHaveProperty("user.image");
      expect(illust).toHaveProperty("image");
    });
  });

  describe("called with subcommand 'month'", () => {
    test("should return null when erros happened in pixiv api call.", async () => {
      pixiv.fetchRankingIllusts.mockRejectedValueOnce("");

      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.MONTH,
        false,
        6
      );

      expect(illusts).toBe(null);
    });

    test("should return a array with length 6 when the number argument is 6.", async () => {
      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.MONTH,
        false,
        6
      );

      expect(illusts).toBeInstanceOf(Array);
      expect(illusts).toHaveLength(6);
    });

    test("should return a array whose entries should have the properties of type ParsedIllustData.", async () => {
      const illusts = await fetchRankingIllusts(
        pixiv,
        RankingMode.MONTH,
        false,
        1
      );
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
