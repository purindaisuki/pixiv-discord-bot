import express from "express";
import axios, { AxiosError } from "axios";

const app = express();
const webHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
  Referer: "https://www.pixiv.net",
};

// route for uptimerobot
app.get("/", (_, res) => {
  res.send("Server is up.");
});

// proxy image
app.get("/image/*", (req, res) => {
  const { path } = req;
  const url = path.slice(7);

  if (!url?.startsWith("i.pximg.net")) {
    res.sendStatus(400);
  }

  axios("https://" + url, { headers: webHeaders, responseType: "arraybuffer" })
    .then((pixivRes) => {
      res.set(pixivRes.headers).status(200).send(pixivRes.data);
    })
    .catch((err) => {
      if ((err as AxiosError).response) {
        res.status(404).send((err as AxiosError).response!.data);
      } else {
        res.status(404).send((err as AxiosError).message);
      }
    });
});

export const listen = () => {
  app.listen(process.env.PORT, () => {
    console.log("Server is ready");
  });
};
