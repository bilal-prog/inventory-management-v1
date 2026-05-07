const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file
const booksRouter = require("./routes/books.routes"); // Import books router
//locales
const i18next = require("i18next"); // Internationalization
const middleware = require("i18next-http-middleware"); // Handle i18next

const app = express(); // Create express app
const port = process.env.PORT || 4000; // Port number

// Load translations directly
const enTranslations = require("./locales/en.json");
const arTranslations = require("./locales/ar.json");

// Initialize i18next
i18next
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en", // Default language
    resources: {
      en: {
        translation: enTranslations,
      },
      ar: {
        translation: arTranslations,
      },
    },
    detection: {
      order: ["querystring", "header", "cookie"],
      lookupQuerystring: "lang",
      lookupHeader: "accept-language",
      caches: false,
    },
    debug: true, // Enable debug mode
  })
  .then(() => {
    app.use(middleware.handle(i18next)); // Handle i18next
    app.use(express.json()); // Parse JSON bodies

    app.use("/books", booksRouter); // Use books router for /books routes (middleware)

    // Start server
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  });

// Connect to MongoDB
const connectionString = process.env.CONNECTION_STRING;

console.log("CONNECTION_STRING =", process.env.CONNECTION_STRING);
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB ^_^"); // Success message
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err); // Error message
  });

const db = mongoose.connection;
// Handle connection errors
db.on("error", console.error.bind(console, "connection error:"));

// Handle successful connection
db.once("open", function () {
  console.log("Connected to MongoDB");
});
