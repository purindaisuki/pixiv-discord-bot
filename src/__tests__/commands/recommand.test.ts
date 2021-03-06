import { mocked } from "ts-jest/utils";
import { recommend, fetchRecommendedIllusts } from "../../commands/recommend";
import PixivAPI from "../../pixiv";
import {
  mockIllustsResponse,
  mockInteraction,
  mockInteractionOptions,
} from "../../__mocks__";

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
  mockInteractionOptions.getInteger.mockClear();

  const { execute } = recommend;

  await execute(pixiv, mockInteraction);

  expect(mockInteraction.options.getInteger).toBeCalledTimes(1);
  expect(mockInteraction.options.getInteger).toBeCalledWith("number");

  expect(pixiv.fetchRecommendedIllusts).toBeCalledTimes(1);
});

describe("fetchRecommendedIllusts(pixiv, number)", () => {
  test("should return null when erros happened in pixiv api call.", async () => {
    pixiv.fetchRecommendedIllusts.mockRejectedValueOnce("");

    const illusts = await fetchRecommendedIllusts(pixiv, 1);

    expect(illusts).toBe(null);
  });

  test("should return a array with length 6 when the number argument is 6.", async () => {
    const illusts = await fetchRecommendedIllusts(pixiv, 6);

    expect(illusts).toBeInstanceOf(Array);
    expect(illusts).toHaveLength(6);
  });

  test("should return a array with length 6 when the number argument is 6.", async () => {
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
