import { mocked } from "ts-jest/utils";
import { followed, fetchFollowedIllusts } from "../../commands/followed";
import PixivAPI from "../../pixiv";
import {
  mockIllustsResponse,
  mockInteraction,
  mockInteractionOptions,
} from "../../__mocks__";

jest.mock("../../pixiv", () =>
  jest.fn().mockImplementation(() => ({
    fetchFollowedIllusts: jest.fn(() => Promise.resolve(mockIllustsResponse)),
  }))
);

const pixiv = mocked(new PixivAPI(""));

beforeEach(() => {
  pixiv.fetchFollowedIllusts.mockClear();
});

test("followed.data should have the properties of the followed slashcommand.", () => {
  const { data } = followed;

  expect(data.name).toBe("followed");
  expect(data.description).toBe("Return followed illustrations");
  expect(data.options).toContainEqual(
    expect.objectContaining({
      name: "number",
      required: false,
      description: "return first %number% results",
    })
  );
});

test("followed.execute(pixiv, interaction) should call pixiv and discord apis.", async () => {
  mockInteractionOptions.getInteger.mockClear();

  const { execute } = followed;

  await execute(pixiv, mockInteraction);

  expect(mockInteraction.options.getInteger).toBeCalledTimes(1);
  expect(mockInteraction.options.getInteger).toBeCalledWith("number");

  expect(pixiv.fetchFollowedIllusts).toBeCalledTimes(1);
});

describe("fetchFollowedIllusts(pixiv, number)", () => {
  test("should return null when erros happened in pixiv api call.", async () => {
    pixiv.fetchFollowedIllusts.mockRejectedValueOnce("");

    const illusts = await fetchFollowedIllusts(pixiv, 1);

    expect(illusts).toBe(null);
  });

  test("should return a array with length 6 when the number argument is 6.", async () => {
    const illusts = await fetchFollowedIllusts(pixiv, 6);

    expect(illusts).toBeInstanceOf(Array);
    expect(illusts).toHaveLength(6);
  });

  test("should return a array whose entries should have the properties of type ParsedIllustData.", async () => {
    const illusts = await fetchFollowedIllusts(pixiv, 1);
    const illust = illusts![0];

    expect(illust).toHaveProperty("id");
    expect(illust).toHaveProperty("caption");
    expect(illust).toHaveProperty("user.id");
    expect(illust).toHaveProperty("user.name");
    expect(illust).toHaveProperty("user.image");
    expect(illust).toHaveProperty("image");
  });
});
