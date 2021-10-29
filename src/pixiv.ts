import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import type {
  IllustBookmarkDetailResponse,
  IllustDetailResponse,
  IllustsResponse,
  SearchIllustsResponse,
  RecommendedIllustsResponse,
  TrendingIllustTagsResponse,
  AuthTokenResponse,
} from "./types/response";
import type { Auth } from "./types/auth";
import {
  ContentType,
  PlatformFilter,
  RankingMode,
  SearchTarget,
  Sort,
  Visibility,
} from "./types/enums";

const BASE_URL = "https://app-api.pixiv.net";
const AUTH_TOKEN_URL = "https://oauth.secure.pixiv.net/auth/token";
const CLIENT_ID = "MOBrBDS8blbauoSck0ZfDbtuzpyT";
const CLIENT_SECRET = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj";

const validateIllustId = (id: number) => id.toString().length === 8;
const queryStringify = (obj: {
  [key: string]: boolean | number | string | undefined;
}) =>
  Object.entries(obj).reduce(
    (queryString, [key, value], ind) =>
      value
        ? queryString + (ind === 0 ? "" : "&") + key + "=" + value
        : queryString,
    ""
  );
const throwRequestError = (err: AxiosError) => {
  if (err.response) {
    console.log(err.response.data);
  }

  throw new Error(err.message);
};

const defaultHeaders = {
  "App-OS": "android",
  "Accept-Language": "en-us",
  "App-OS-Version": "9.0",
  "App-Version": "5.0.234",
  "User-Agent": "PixivAndroidApp/5.0.234  (Android 9.0; Pixel 3)",
  "Content-Type": "application/x-www-form-urlencoded",
};

export default class PixivAPI {
  headers: Exclude<AxiosRequestConfig["headers"], undefined>;
  auth?: Auth;
  refreshToken: string;

  constructor(
    refreshToken: string,
    headers: AxiosRequestConfig["headers"] = {}
  ) {
    this.headers = { ...defaultHeaders, ...headers };
    this.refreshToken = refreshToken;
  }

  /**
   * refreshes access token, requiring refresh token
   */
  async refreshAccessToken() {
    const data = queryStringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      include_policy: "true",
      grant_type: "refresh_token",
      refresh_token: this.refreshToken,
    });

    const config = {
      method: "POST" as Method,
      headers: this.headers,
      data,
    };

    try {
      const res = await axios(AUTH_TOKEN_URL, config);

      this.auth = (res.data as AuthTokenResponse).response;
    } catch (err) {
      console.log("Refresh fail");
      throwRequestError(err as AxiosError);
    }
  }

  /**
   * request data
   * @param path
   * @param params parameters for query string
   * @param retryOnce whether retry again at bad request
   * @param config request config
   * @returns
   */
  async _requestData(
    path: string,
    params?: {
      [key: string]: boolean | number | string | undefined;
    },
    retryOnce = true,
    config?: AxiosRequestConfig
  ) {
    if (!path.startsWith("/")) {
      return Promise.reject(new Error("invalid path"));
    }

    const queryString = params ? queryStringify(params) : "";
    const requestUrl = BASE_URL + path + queryString;

    const defaultConfig = {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.auth?.access_token}`,
      },
    };
    const requestConfig = config
      ? { ...defaultConfig, ...config }
      : defaultConfig;

    try {
      const res = await axios(requestUrl, requestConfig);

      return res.data;
    } catch (err) {
      if (retryOnce && (err as AxiosError).response?.status === 400) {
        await this.refreshAccessToken();

        const newConfig = {
          ...requestConfig,
          headers: {
            ...requestConfig.headers,
            Authorization: `Bearer ${(this.auth as Auth).access_token}`,
          },
        };

        try {
          const retryRes = await axios(requestUrl, newConfig);

          return retryRes.data;
        } catch (retryErr) {
          console.log("Retry failed");
          throwRequestError(retryErr as AxiosError);
        }
      }

      console.log("Request failed");
      throwRequestError(err as AxiosError);
    }
  }

  /**
   * return first 30 latest search results
   * popularity search works for premium accounts
   * @param word
   * @param sort
   * @param search_target
   * @param filter
   * @returns
   */
  searchLatestIllusts(
    word: string,
    sort: Sort = Sort.DATE_DESC,
    search_target: SearchTarget = SearchTarget.TAGS_PARTIAL,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    if (!word) {
      return Promise.reject(new Error("invalid word"));
    }

    return this._requestData("/v1/search/illust?", {
      word: encodeURIComponent(word),
      search_target,
      sort,
      filter,
    }) as Promise<SearchIllustsResponse>;
  }

  /**
   * return first 30 popular search previews
   * @param word
   * @param search_target
   * @param filter
   * @returns
   */
  searchPopularIllustsPreview(
    word: string,
    search_target: SearchTarget = SearchTarget.TAGS_PARTIAL,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    if (!word) {
      return Promise.reject(new Error("invalid word"));
    }

    return this._requestData("/v1/search/popular-preview/illust?", {
      word: encodeURIComponent(word),
      search_target,
      filter,
    }) as Promise<SearchIllustsResponse>;
  }

  /**
   * return illust detail
   * @param id
   * @param filter
   * @returns
   */
  fetchIllustDetail(
    id: number,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    if (!validateIllustId(id)) {
      return Promise.reject(new Error("invalid id"));
    }

    return this._requestData("/v1/illust/detail?", {
      illust_id: id,
      filter,
    }) as Promise<IllustDetailResponse>;
  }

  /**
   * return bookmark info and tags of the illust
   * @param id
   * @param filter
   * @returns
   */
  fetchIllustBookmarkDetail(
    id: number,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    if (!validateIllustId(id)) {
      return Promise.reject(new Error("invalid id"));
    }

    return this._requestData("/v2/illust/bookmark/detail?", {
      illust_id: id,
      filter,
    }) as Promise<IllustBookmarkDetailResponse>;
  }

  /**
   * return first 30 related illustrations and next URL
   * @param id
   * @param offset
   * @param filter
   * @returns
   */
  fetchRelatedIllusts(
    id: number,
    offset?: number,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    if (!validateIllustId(id)) {
      return Promise.reject(new Error("invalid id"));
    }

    return this._requestData("/v2/illust/related?", {
      illust_id: id,
      offset,
      filter,
    }) as Promise<IllustsResponse>;
  }

  /**
   * return first 30 latest uploaded illustrations and next URL
   * @param content_type
   * @param offset
   * @param filter
   * @returns
   */
  fetchLatestIllusts(
    content_type: ContentType.ILLUST | ContentType.MANGA = ContentType.ILLUST,
    offset?: number,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    return this._requestData("/v1/illust/new?", {
      content_type,
      offset,
      filter,
    }) as Promise<IllustsResponse>;
  }

  /**
   * return first 30 latest followed illustrations and next URL
   * @param restrict
   * @param offset
   * @param filter
   * @returns
   */
  fetchFollowedIllusts(
    restrict: Visibility = Visibility.ALL,
    offset?: number,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    return this._requestData("/v2/illust/follow?", {
      restrict,
      offset,
      filter,
    }) as Promise<IllustsResponse>;
  }

  /**
   * return first 30 latest recommended illustrations and next URL
   * @param content_type
   * @param include_ranking_illusts additionally return top 10 illustrations
   * @param include_ranking_label
   * @param include_privacy_policy
   * @param offset
   * @param max_bookmark_id_for_recommend request results whose id is not large than the id
   * @param min_bookmark_id_for_recent_illustrations request results whose id is not smaller than the id
   * @param bookmark_illust_ids bookmark ids of illustrations that should be considered
   * @param filter
   * @returns
   */
  fetchRecommendedIllusts(
    content_type: ContentType.ILLUST | ContentType.MANGA = ContentType.ILLUST,
    include_ranking_illusts = false,
    include_ranking_label = true,
    include_privacy_policy = false,
    offset?: number,
    max_bookmark_id_for_recommend?: number,
    min_bookmark_id_for_recent_illustrations?: number,
    bookmark_illust_ids?: number[],
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    let bookmarkIllustIds;
    if (bookmark_illust_ids?.length) {
      bookmarkIllustIds = bookmark_illust_ids.join();
    }

    return this._requestData("/v1/illust/recommended?", {
      content_type,
      include_ranking_illusts,
      include_ranking_label,
      include_privacy_policy,
      offset,
      max_bookmark_id_for_recommend,
      min_bookmark_id_for_recent_illustrations,
      bookmark_illust_ids: bookmarkIllustIds,
      filter,
    }) as Promise<RecommendedIllustsResponse>;
  }

  /**
   * return first 30 latest ranking illustrations and next URL
   * @param mode
   * @param date return results ending with the date, in YYYY-MM-DD fromat
   * @param offset
   * @param filter
   * @returns
   */
  fetchRankingIllusts(
    mode: RankingMode = RankingMode.DAY,
    date?: string,
    offset?: number,
    filter: PlatformFilter = PlatformFilter.ANDORID
  ) {
    return this._requestData("/v1/illust/ranking?", {
      mode,
      date,
      offset,
      filter,
    }) as Promise<IllustsResponse>;
  }

  /**
   * return first 40 trending illustration tags
   * @param filter
   * @returns
   */
  fetchTrendingIllustTags(filter: PlatformFilter = PlatformFilter.ANDORID) {
    return this._requestData("/v1/trending-tags/illust?", {
      filter,
    }) as Promise<TrendingIllustTagsResponse>;
  }
}
