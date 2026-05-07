const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const booksRouter = require("./routes/books.routes");
const i18next = require("i18next");
const middleware = require("i18next-http-middleware");

const app = express();
const port = process.env.PORT || 4000;

// middleware that does NOT depend on async init
app.use(express.json());

// health checks FIRST (important for Railway)
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/ping", (req, res) => res.status(200).send("pong"));

app.use("/books", booksRouter);

// init i18next separately
const en = require("./locales/en.json");
const ar = require("./locales/ar.json");

i18next
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    detection: {
      order: ["querystring", "header", "cookie"],
      lookupQuerystring: "lang",
      lookupHeader: "accept-language",
      caches: false,
    },
    debug: false,
  })
  .then(() => {
    app.use(middleware.handle(i18next));

    app.listen(port, "0.0.0.0", async () => {
      console.log(`Server running on port ${port}`);

      try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("MongoDB connected");
      } catch (err) {
        console.error("MongoDB connection failed:", err);
      }
    });
  });
