export enum ContentType {
  ILLUST = "illust",
  MANGA = "mange",
  UGOIRA = "ugoira",
  NOVEL = "novel",
}

export enum Duartion {
  LAST_DAY = "within_last_day",
  LAST_WEEK = "within_last_week",
  LAST_MONTH = "within_last_month",
}

export enum RankingMode {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  DAY_MALE = "day_male",
  DAY_FEMALE = "day_female",
  WEEK_ORIGINAL = "week_original",
  WEEK_ROOKIE = "week_rookie",
  DAY_MANGA = "day_manga",
}

export enum SearchTarget {
  TAGS_PARTIAL = "partial_match_for_tags",
  TAGS_EXACT = "exact_match_for_tags",
  TITLE_AND_CAPTION = "title_and_caption",
}

export enum Size {
  LARGE = "large",
  MEDIUM = "medium",
  ORIGINAL = "original",
  SQUARE_MEDIUM = "square_medium",
}

export enum Sort {
  DATE_DESC = "date_desc",
  DATE_ASC = "date_asc",
}

export enum Visibility {
  ALL = "all",
  PUBLIC = "public",
  PRIVATE = "private",
}
