const { body, param, validationResult } = require("express-validator");

const createBookValidation = [
  body("title")
    .notEmpty()
    .withMessage((value, { req }) => req.t("titleRequired"))
    .isLength({ min: 5, max: 100 })
    .withMessage((value, { req }) => req.t("titleLength")),
  body("author")
    .notEmpty()
    .withMessage((value, { req }) => req.t("authorRequired"))
    .isLength({ min: 3, max: 100 })
    .withMessage((value, { req }) => req.t("authorLength")),
  body("price")
    .isFloat({ min: 1, max: 1000 })
    .withMessage((value, { req }) => req.t("priceRequired")),
  body("image")
    .optional()
    .isURL()
    .withMessage((value, { req }) => req.t("imageValid")),
];

const updateBookValidation = [
  body("title")
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage((value, { req }) => req.t("titleLength")),
  body("author")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage((value, { req }) => req.t("authorLength")),
  body("price")
    .optional()
    .isFloat({ min: 1, max: 1000 })
    .withMessage((value, { req }) => req.t("priceRequired")),
  body("image")
    .optional()
    .isURL()
    .withMessage((value, { req }) => req.t("imageValid")),
];

const byIdValidation = [
  param("id")
    .isMongoId()
    .withMessage((value, { req }) => req.t("invalidBookId")),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: req.t("validationFailed") });
  }
  next();
};

module.exports = {
  createBookValidation,
  updateBookValidation,
  byIdValidation,
  handleValidationErrors,
};
