import type { Auth } from "./auth";
import type { ContentType, Visibility } from "./enums";

export type AuthTokenResponse = Auth & {
  response: Auth;
};

type Illust = {
  id: number;
  title: string;
  type: ContentType.ILLUST | ContentType.MANGA | ContentType.UGOIRA;
  image_urls: {
    square_medium: string;
    medium: string;
    large: string;
  };
  caption: string;
  restrict: number;
  user: {
    id: number;
    name: string;
    account: string;
    profile_image_urls: {
      medium: string;
    };
    is_followed: boolean;
  };
  tags: {
    name: string;
    translated_name: string | null;
  }[];
  tools: string[];
  create_date: string;
  page_count: number;
  width: number;
  height: number;
  sanity_level: number;
  x_restrict: number;
  series: {
    id: number;
    title: string;
  } | null;
  meta_single_page: {
    original_image_url: string;
  };
  meta_pages: {
    image_urls: {
      square_medium: string;
      medium: string;
      large: string;
      original: string;
    };
  }[];
  total_view: number;
  total_bookmarks: number;
  is_bookmarked: boolean;
  visible: boolean;
  is_muted: boolean;
  total_comments?: number;
};

export type ParsedIllustData = {
  id: number;
  caption: string;
  title: string;
  user: {
    id: number;
    name: string;
    account: string;
    image: string | null;
    is_followed: boolean;
  };
  image: string;
};

export type SearchIllustsResponse = {
  illusts: Illust[];
  next_url?: string;
  search_span_limit: number;
};

export type IllustBookmarkDetailResponse = {
  bookmark_detail: {
    is_bookmarked: boolean;
    tags: {
      name: string;
      is_registered: boolean;
    }[];
    restrict: Visibility;
  };
};

export type IllustDetailResponse = {
  illust: Illust;
};

export type IllustsResponse = {
  illusts: Illust[];
  next_url: string;
};

export type RecommendedIllustsResponse = IllustsResponse & {
  ranking_illusts: Illust[];
  contest_exists: boolean;
  privacy_policy: unknown;
};

export type TrendingIllustTagsResponse = {
  trend_tags: {
    tag: string;
    translated_name: string;
    illust: Illust;
  }[];
};
