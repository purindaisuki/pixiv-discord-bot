export const mockIllust = {
  id: 93725836,
  title:
    "\u30b9\u30fc\u30d1\u30fc\u5317\u4e0a\u3055\u307e\u3068\u7d20\u3063\u3071\u30fc\u5927\u4e95\u3063\u3061",
  type: "illust",
  image_urls: {
    square_medium:
      "https://i.pximg.net/c/540x540_10_webp/img-master/img/2021/10/27/23/49/40/93725836_p0_square1200.jpg",
    medium:
      "https://i.pximg.net/c/540x540_70/img-master/img/2021/10/27/23/49/40/93725836_p0_master1200.jpg",
    large:
      "https://i.pximg.net/c/600x1200_90_webp/img-master/img/2021/10/27/23/49/40/93725836_p0_master1200.jpg",
  },
  caption:
    "\u4eca\u65e5\u306e\u304a\u984c\uff5e\u003Cbr /\u003E\u2460\u30a6\u30a9\u30fc\u30b9\u30d1\u30a4\u30c8\u3000\u2461\u5317\u4e0a\u3000\u2462\u8429\u98a8\u3000\u2463\u671d\u98a8\u003Cbr /\u003E\u2461\u3067\u3059\u3002\u30de\u30a4\u30ca\u30b9\u306b\u30de\u30a4\u30ca\u30b9\u3076\u3064\u3051\u305f\u3089\u30d7\u30e9\u30b9\u306b\u306a\u3089\u306a\u304b\u3063\u305f\u306e\u3067\u8ae6\u3081\u308b\u5317\u4e0a\u3002\u003Cbr /\u003E\u003Cbr /\u003E\u3000",
  restrict: 0,
  user: {
    id: 12509965,
    name: "\u30a4\u30cb\u30cb\u30ed\u30b7\u30e0\u30ed",
    account: "ininiro",
    profile_image_urls: {
      medium:
        "https://i.pximg.net/user-profile/img/2018/06/24/07/21/43/14398264_7e4f869a4fd89b0076e6c6c023218769_170.jpg",
    },
    is_followed: false,
  },
  tags: [
    {
      name: "\u8266\u3053\u308c",
      translated_name: "Kancolle",
    },
    {
      name: "\u5317\u4e0a(\u8266\u3053\u308c)",
      translated_name: null,
    },
    {
      name: "\u7403\u78e8/\u591a\u6469/\u5927\u4e95",
      translated_name: null,
    },
  ],
  tools: [],
  create_date: "2021-10-27T23:49:40+09:00",
  page_count: 2,
  width: 868,
  height: 1228,
  sanity_level: 0,
  x_restrict: 0,
  series: null,
  meta_single_page: {},
  meta_pages: [
    {
      image_urls: {
        square_medium:
          "https://i.pximg.net/c/360x360_10_webp/img-master/img/2021/10/27/23/49/40/93725836_p0_square1200.jpg",
        medium:
          "https://i.pximg.net/c/540x540_70/img-master/img/2021/10/27/23/49/40/93725836_p0_master1200.jpg",
        large:
          "https://i.pximg.net/c/600x1200_90_webp/img-master/img/2021/10/27/23/49/40/93725836_p0_master1200.jpg",
        original:
          "https://i.pximg.net/img-original/img/2021/10/27/23/49/40/93725836_p0.jpg",
      },
    },
    {
      image_urls: {
        square_medium:
          "https://i.pximg.net/c/360x360_10_webp/img-master/img/2021/10/27/23/49/40/93725836_p1_square1200.jpg",
        medium:
          "https://i.pximg.net/c/540x540_70/img-master/img/2021/10/27/23/49/40/93725836_p1_master1200.jpg",
        large:
          "https://i.pximg.net/c/600x1200_90_webp/img-master/img/2021/10/27/23/49/40/93725836_p1_master1200.jpg",
        original:
          "https://i.pximg.net/img-original/img/2021/10/27/23/49/40/93725836_p1.jpg",
      },
    },
  ],
  total_view: 23,
  total_bookmarks: 4,
  is_bookmarked: false,
  visible: true,
  is_muted: false,
};

const mockIllustsResponse = {
  illusts: Array(30).fill(mockIllust),
  next_url:
    "https://app-api.pixiv.net/v1/search/illust?word=%E8%89%A6%E3%81%93%E3%82%8C\u0026offset=30",
  search_span_limit: 31536000,
};

export default mockIllustsResponse;
