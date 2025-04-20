const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middleware.js")
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js")

//create review route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createRoute));

//delete review route
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;