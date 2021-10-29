import supertest from "supertest";
import app from "../server";

const api = supertest(app);

test("Server should return string to GET '/'", async () => {
  await api.get("/").expect(200).expect("Server is up.");
});

describe("When receiving GET '/image/*'", () => {
  // uncover erros when setting up the axios request

  test("Server should return 400 to the path not starting with 'i.pximg.net'.", async () => {
    const INVALID_URL = "/image/invalid/path";

    await api.get(INVALID_URL).expect(400);
  });

  test("Server should return 404 if Pixiv server returns not found.", async () => {
    const NOT_FOUND_URL =
      "/image/i.pximg.net/img-original/img/2077/12/10/00/00/00/not_found.jpg";

    await api.get(NOT_FOUND_URL).expect(404);
  });

  test("Server should return the requested image.", async () => {
    const TEST_URL =
      "/image/i.pximg.net/img-original/img/2018/07/24/20/49/16/69841518_p0.jpg";

    await api
      .get(TEST_URL)
      .expect(200)
      .expect("Content-Type", /image\/jpeg/);
  });
});
