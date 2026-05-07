const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const booksRouter = require("./routes/books.routes");
const i18next = require("i18next");
const middleware = require("i18next-http-middleware");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// 🚨 HEALTH CHECK MUST BE FIRST
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/ping", (req, res) => res.status(200).send("pong"));

// attach routes early
app.use("/books", booksRouter);

async function start() {
  try {
    // 1. DB FIRST (critical)
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("MongoDB connected");

    // 2. i18n init (non-blocking)
    const en = require("./locales/en.json");
    const ar = require("./locales/ar.json");

    await i18next.init({
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
    });

    app.use(middleware.handle(i18next));

    // 3. START SERVER LAST
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
