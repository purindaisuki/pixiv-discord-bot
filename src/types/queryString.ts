import {
  Duartion,
  ContentType,
  SearchTarget,
  Sort,
  Visibility,
  RankingMode,
} from "./enums";

export type SearchIllustParams = {
  word: string;
  search_target: SearchTarget;
  sort?: Sort;
  duration?: Duartion;
  offset?: number;
};

export type IllustBookmarkDetailParams = {
  illust_id: number;
};

export type RelatedIllustsParams = {
  illust_id: number;
  offset?: number;
};

export type LatestIllustsParams = {
  content_type: ContentType.ILLUST | ContentType.MANGA;
  offset?: number;
};

export type FollowedIllustsParams = {
  restrict: Visibility;
  offset?: number;
};

export type RecommendedIllustParams = {
  content_type: ContentType.ILLUST | ContentType.MANGA;
  include_ranking_illusts: boolean;
  include_ranking_label: boolean;
  include_privacy_policy: boolean;
  offset?: number;
  max_bookmark_id_for_recommend?: number;
  min_bookmark_id_for_recent_illustrations?: number;
  bookmark_illust_ids?: number[];
};

export type RankingIllustParams = {
  mode: RankingMode;
  date?: string;
  offset?: number;
};
