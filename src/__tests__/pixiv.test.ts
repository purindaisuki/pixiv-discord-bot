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

test("PixivAPI should expose a constructor.", () => {
  expect(PixivAPI).toBeInstanceOf(Function);
});

test("PixivAPI should throw with 400 with an invalid refresh token.", async () => {
  const invalidToken = "123456";

  await expect(new PixivAPI(invalidToken).refreshAccessToken()).rejects.toThrow(
    "Request failed with status code 400"
  );
});

test("PixivAPI should have auth.access_token and refreshToken properties.", () => {
  expect(pixiv).toHaveProperty("refreshToken");
  expect(pixiv).toHaveProperty("auth.access_token");
});

describe("When searching latest illustrations,", () => {
  test("PixivAPI should reject invalid queries.", async () => {
    await expect(pixiv.searchLatestIllusts("")).rejects.toThrow("invalid word");
  });

  test("PixivAPI should return an valid result with the query.", async () => {
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

describe("When searching popular illustrations,", () => {
  test("PixivAPI should reject invalid queries.", async () => {
    await expect(pixiv.searchPopularIllustsPreview("")).rejects.toThrow(
      "invalid word"
    );
  });

  test("PixivAPI should return an valid result with the query.", async () => {
    expect.assertions(3);

    try {
      const res = await pixiv.searchPopularIllustsPreview(TEST_QUERY);

      expect(res).toHaveProperty("search_span_limit");
      expect(res).toHaveProperty("illusts");
      expect((res as { illusts: unknown }).illusts).toBeIllustArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

describe("When fetching the illustration detail,", () => {
  test("PixivAPI should reject invalid id.", async () => {
    await expect(pixiv.fetchIllustDetail(123)).rejects.toThrow("invalid id");
  });

  test("PixivAPI should return an valid result with the id.", async () => {
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

describe("When fetching the illustration bookmark detail,", () => {
  test("PixivAPI should reject invalid id.", async () => {
    await expect(pixiv.fetchIllustBookmarkDetail(123)).rejects.toThrow(
      "invalid id"
    );
  });

  test("PixivAPI should return an valid result with the id.", async () => {
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

describe("When fetching the related illustrations,", () => {
  test("PixivAPI should reject invalid id.", async () => {
    await expect(pixiv.fetchRelatedIllusts(123)).rejects.toThrow("invalid id");
  });

  test("PixivAPI should return an valid result with the id.", async () => {
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

test("PixivAPI should fetch valid latest illustrations.", async () => {
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

test("PixivAPI should fetch valid followed illustrations.", async () => {
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

describe("When fetching the recommended illustrations,", () => {
  test("PixivAPI should fetch valid recommended illustrations.", async () => {
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

  test("PixivAPI should fetch valid recommended illustrations including ranking results.", async () => {
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

test("PixivAPI should fetch valid ranking illustrations.", async () => {
  expect.assertions(3);

  try {
    const res = await pixiv.fetchRankingIllusts();

    expect(res).toHaveProperty("next_url");
    expect(res).toHaveProperty("illusts");
    expect((res as { illusts: unknown }).illusts).toBeIllustArray();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

test("PixivAPI should fetch valid trending tags.", async () => {
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
