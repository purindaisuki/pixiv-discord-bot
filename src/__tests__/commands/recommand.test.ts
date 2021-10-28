import { CommandInteraction } from "discord.js";
import { mocked } from "ts-jest/utils";
import { recommend, fetchRecommendedIllusts } from "../../commands/recommend";
import PixivAPI from "../../pixiv";
import mockIllustsResponse from "../../__mocks__/mockIllustsResponse";

jest.mock("../../pixiv", () =>
  jest.fn().mockImplementation(() => ({
    fetchRecommendedIllusts: jest.fn(() =>
      Promise.resolve(mockIllustsResponse)
    ),
  }))
);

const pixiv = mocked(new PixivAPI(""));

beforeEach(() => {
  pixiv.fetchRecommendedIllusts.mockClear();
});

test("recommend.data should have the properties of the recommend slashcommand.", () => {
  const { data } = recommend;

  expect(data.name).toBe("recommend");
  expect(data.description).toBe("Return recommended illustrations");
  expect(data.options).toContainEqual(
    expect.objectContaining({
      name: "number",
      required: false,
      description: "return first %number% results",
    })
  );
});

test("recommend.execute(pixiv, interaction) should call pixiv and discord apis.", async () => {
  const { execute } = recommend;
  const mockInteraction = {
    reply: jest.fn() as Partial<CommandInteraction["reply"]>,
    options: {
      getInteger: jest.fn(),
    } as Partial<CommandInteraction["options"]>,
  } as CommandInteraction;

  await execute(pixiv, mockInteraction);

  expect(mockInteraction.options.getInteger).toBeCalledTimes(1);
  expect(mockInteraction.options.getInteger).toBeCalledWith("number");

  expect(pixiv.fetchRecommendedIllusts).toBeCalledTimes(1);
});

describe("fetchRecommendedIllusts(pixiv, number) should return a array", () => {
  test("with length 6 when the number argument is 6.", async () => {
    const illusts = await fetchRecommendedIllusts(pixiv, 6);

    expect(illusts).toBeInstanceOf(Array);
    expect(illusts).toHaveLength(6);
  });

  test("whose entries should have the properties of type ParsedIllustData.", async () => {
    const illusts = await fetchRecommendedIllusts(pixiv, 1);
    const illust = illusts![0];

    expect(illust).toHaveProperty("id");
    expect(illust).toHaveProperty("caption");
    expect(illust).toHaveProperty("user.id");
    expect(illust).toHaveProperty("user.name");
    expect(illust).toHaveProperty("user.image");
    expect(illust).toHaveProperty("image");
  });
});
