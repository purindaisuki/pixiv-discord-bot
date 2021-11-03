import { mocked } from "ts-jest/utils";
import { latest, fetchLatestIllusts } from "../../commands/new";
import PixivAPI from "../../pixiv";
import {
  mockIllustsResponse,
  mockInteraction,
  mockInteractionOptions,
} from "../../__mocks__";

jest.mock("../../pixiv", () =>
  jest.fn().mockImplementation(() => ({
    fetchLatestIllusts: jest.fn(() => Promise.resolve(mockIllustsResponse)),
  }))
);

const pixiv = mocked(new PixivAPI(""));

beforeEach(() => {
  pixiv.fetchLatestIllusts.mockClear();
});

test("latest.data should have the properties of the new slashcommand.", () => {
  const { data } = latest;

  expect(data.name).toBe("new");
  expect(data.description).toBe("Return new illustrations");
  expect(data.options).toContainEqual(
    expect.objectContaining({
      name: "number",
      required: false,
      description: "return first %number% results",
    })
  );
});

test("latest.execute(pixiv, interaction) should call pixiv and discord apis.", async () => {
  mockInteractionOptions.getInteger.mockClear();

  const { execute } = latest;

  await execute(pixiv, mockInteraction);

  expect(mockInteraction.options.getInteger).toBeCalledTimes(1);
  expect(mockInteraction.options.getInteger).toBeCalledWith("number");

  expect(pixiv.fetchLatestIllusts).toBeCalledTimes(1);
});

describe("fetchLatestIllusts(pixiv, number)", () => {
  test("should return null when erros happened in pixiv api call.", async () => {
    pixiv.fetchLatestIllusts.mockRejectedValueOnce("");

    const illusts = await fetchLatestIllusts(pixiv, 1);

    expect(illusts).toBe(null);
  });

  test("should return a array with length 6 when the number argument is 6.", async () => {
    const illusts = await fetchLatestIllusts(pixiv, 6);

    expect(illusts).toBeInstanceOf(Array);
    expect(illusts).toHaveLength(6);
  });

  test("should return a array whose entries should have the properties of type ParsedIllustData.", async () => {
    const illusts = await fetchLatestIllusts(pixiv, 1);
    const illust = illusts![0];

    expect(illust).toHaveProperty("id");
    expect(illust).toHaveProperty("caption");
    expect(illust).toHaveProperty("user.id");
    expect(illust).toHaveProperty("user.name");
    expect(illust).toHaveProperty("user.image");
    expect(illust).toHaveProperty("image");
  });
});
