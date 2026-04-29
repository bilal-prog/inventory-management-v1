const express = require("express");
const Book = require("../models/Book.model");
const {
  createBookValidation,
  updateBookValidation,
  handleValidationErrors,
  byIdValidation,
} = require("../validators/book.validator");

const router = express.Router();

// Create a new book
router.post(
  "/",
  createBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const newBook = await Book.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a book by ID
router.get("/:id", byIdValidation, handleValidationErrors, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
router.delete(
  "/:id",
  byIdValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ error: req.t("notFound") });
      }
      res.status(200).json({ message: req.t("deleted") });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Full update (PUT)
router.put(
  "/:id",
  byIdValidation,
  updateBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!book) {
        return res.status(404).json({ error: req.t("notFound") });
      }
      res.status(200).json({ message: req.t("updated"), result: book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Partial update (PATCH)
router.patch(
  "/:id",
  byIdValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!book) {
        return res.status(404).json({ error: req.t("notFound") });
      }
      res.status(200).json({ message: req.t("updated"), result: book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

module.exports = router;
