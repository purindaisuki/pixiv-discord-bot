import { ContentType } from "../types/enums";
import PixivAPI from "../pixiv";
import config from "../config";

const TEST_ILLUST_ID = 69841518;
const TEST_QUERY = "艦これ";
let pixiv: PixivAPI;

const setup = async () => {
  pixiv = new PixivAPI(config.pixivRefreshToken!);
  await pixiv.refreshAccessToken();
};

beforeAll(() => setup());

test("should expose a constructor", () => {
  expect(PixivAPI).toBeInstanceOf(Function);
});

test("should fail to refresh token", async () => {
  const invalidToken = "123456";

  await expect(new PixivAPI(invalidToken).refreshAccessToken()).rejects.toThrow(
    "Request failed with status code 400"
  );
});

test("should have access_token and refreshToken", () => {
  expect(pixiv.refreshToken).not.toBe(undefined);
  expect(pixiv.auth?.access_token).not.toBe(undefined);
});

describe("search latest illustrations matching the query", () => {
  test("should reject invalid queries", async () => {
    await expect(pixiv.searchLatestIllusts("")).rejects.toThrow("invalid word");
  });

  test("should return a valid response", async () => {
    expect.assertions(3);

    try {
      const res = await pixiv.searchLatestIllusts(TEST_QUERY);

      expect(res).toHaveProperty("search_span_limit");
      expect(res).toHaveProperty("illusts");
      expect((res as { illusts: unknown }).illusts).toBeIllustArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

describe("search popular illustrations matching the query", () => {
  test("should reject invalid queries", async () => {
    await expect(pixiv.searchPopularIllustsPreview("")).rejects.toThrow(
      "invalid word"
    );
  });

  test("should return a valid response", async () => {
    expect.assertions(3);

    try {
      const res = await pixiv.searchLatestIllusts(TEST_QUERY);

      expect(res).toHaveProperty("search_span_limit");
      expect(res).toHaveProperty("illusts");
      expect((res as { illusts: unknown }).illusts).toBeIllustArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

describe("fetch illustration detail by id", () => {
  test("should reject invalid id", async () => {
    await expect(pixiv.fetchIllustDetail(123)).rejects.toThrow("invalid id");
  });

  test("should return a valid response", async () => {
    expect.assertions(1);

    try {
      const res = await pixiv.fetchIllustDetail(TEST_ILLUST_ID);

      expect(res.illust).toBeIllust();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

describe("fetch illustration bookmark detail by id", () => {
  test("should reject invalid id", async () => {
    await expect(pixiv.fetchIllustBookmarkDetail(123)).rejects.toThrow(
      "invalid id"
    );
  });

  test("should return a valid response", async () => {
    expect.assertions(5);

    try {
      const res = await pixiv.fetchIllustBookmarkDetail(TEST_ILLUST_ID);

      expect(res).toHaveProperty("bookmark_detail");
      expect(res).toHaveProperty("bookmark_detail");
      expect(res).toHaveProperty("bookmark_detail.is_bookmarked");
      expect(res).toHaveProperty("bookmark_detail.tags");
      expect(res).toHaveProperty("bookmark_detail.restrict");
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

describe("fetch related illustrations by id", () => {
  test("should reject invalid id", async () => {
    await expect(pixiv.fetchRelatedIllusts(123)).rejects.toThrow("invalid id");
  });

  test("should return a valid response", async () => {
    expect.assertions(3);

    try {
      const res = await pixiv.fetchRelatedIllusts(TEST_ILLUST_ID);

      expect(res).toHaveProperty("next_url");
      expect(res).toHaveProperty("illusts");
      expect((res as { illusts: unknown }).illusts).toBeIllustArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

test("should fetch latest illustrations", async () => {
  expect.assertions(3);

  try {
    const res = await pixiv.fetchLatestIllusts();

    expect(res).toHaveProperty("next_url");
    expect(res).toHaveProperty("illusts");
    expect((res as { illusts: unknown }).illusts).toBeIllustArray();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

test("should fetch followed illustrations", async () => {
  expect.assertions(3);

  try {
    const res = await pixiv.fetchFollowedIllusts();

    expect(res).toHaveProperty("next_url");
    expect(res).toHaveProperty("illusts");
    expect((res as { illusts: unknown }).illusts).toBeIllustArray();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

describe("fetch recommended illustrations", () => {
  test("should fetch recommended illustrations", async () => {
    expect.assertions(4);

    try {
      const res = await pixiv.fetchRecommendedIllusts();

      expect(res).toHaveProperty("next_url");
      expect(res).toHaveProperty("contest_exists");
      expect(res).toHaveProperty("illusts");
      expect((res as { illusts: unknown }).illusts).toBeIllustArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  test("should fetch recommended illustrations including ranking results", async () => {
    expect.assertions(6);

    try {
      const res = await pixiv.fetchRecommendedIllusts(ContentType.ILLUST, true);

      expect(res).toHaveProperty("next_url");
      expect(res).toHaveProperty("contest_exists");
      expect(res).toHaveProperty("illusts");
      expect((res as { illusts: unknown }).illusts).toBeIllustArray();
      expect(res).toHaveProperty("ranking_illusts");
      expect(
        (res as { ranking_illusts: unknown }).ranking_illusts
      ).toBeIllustArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

test("should fetch ranking illustrations", async () => {
  expect.assertions(3);

  try {
    const res = await pixiv.fetchRankingIllust();

    expect(res).toHaveProperty("next_url");
    expect(res).toHaveProperty("illusts");
    expect((res as { illusts: unknown }).illusts).toBeIllustArray();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

test("should fetch trending tags", async () => {
  expect.assertions(2);

  try {
    const res = await pixiv.fetchTrendingIllustTags();

    expect(res).toHaveProperty("trend_tags");
    expect((res as { trend_tags: unknown }).trend_tags).toBeTagArray();
  } catch (err) {
    console.log(err);
    throw err;
  }
});
