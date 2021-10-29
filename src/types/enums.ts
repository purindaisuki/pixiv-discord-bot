export enum PlatformFilter {
  ANDORID = "for_android",
  IOS = "for_ios",
}

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
  DAY_R18 = "day_r18",
  DAY_MALE_R18 = "day_male_r18",
  DAY_FEMALE_R18 = "day_female_r18",
  WEEK_R18 = "week_r18",
  WEERK_R18G = "week_r18g",
  DAY_MANGA = "day_manga",
  WEEK_MANGA = "week_manga",
  MONTH_MANGA = "month_manga",
  WEEK_ROOKIE_MANGA = "week_rookie_manga",
  DAY_R18_MANGA = "day_r18_manga",
  WEEK_R18_MANGA = "week_r18_manga",
  WEEK_R18G_MANGA = "week_r18g_manga",
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
  POPULAR_DESC = "popular_desc",
}

export enum Visibility {
  ALL = "all",
  PUBLIC = "public",
  PRIVATE = "private",
}
