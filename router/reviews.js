const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");

// create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createRoute));

// delete review route
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;