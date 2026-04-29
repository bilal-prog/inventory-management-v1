const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: [5, "Title must be at least 5 characters long"],
    maxLength: [100, "Title must be at most 100 characters long"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    minLength: [3, "Author must be at least 3 characters long"],
    maxLength: [100, "Author must be at most 100 characters long"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be at least 1 USD"],
    max: [1000, "Price must be less than 1000 USD"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "",
    validate: {
      validator: function (v) {
        if (!v) return true;
        return v.startsWith("https");
      },
      message: "Image must be a valid URL",
    },
  },
});

//
bookSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

//
bookSchema.set("toJSON", {
  virtuals: true,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
