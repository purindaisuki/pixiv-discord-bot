import supertest from "supertest";
import app from "../server";

const api = supertest(app);

test("should return string", async () => {
  await api.get("/").expect(200).expect("Server is up.");
});

test("should return 400", async () => {
  const INVALID_URL = "/image/invalid/url";

  await api.get(INVALID_URL).expect(400);
});

test("should return 404", async () => {
  const NOT_FOUND_URL =
    "/image/i.pximg.net/img-original/img/2077/12/10/00/00/00/not_found.jpg";

  await api.get(NOT_FOUND_URL).expect(404);
});

test("should return image", async () => {
  const TEST_URL =
    "/image/i.pximg.net/img-original/img/2018/07/24/20/49/16/69841518_p0.jpg";

  await api
    .get(TEST_URL)
    .expect(200)
    .expect("Content-Type", /image\/jpeg/);
});
