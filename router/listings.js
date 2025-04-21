const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage: storage });
const listingController = require("../controller/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next()
    }
};

router
    .route("/")
    .get(listingController.indexRoute)
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(listingController.createRoute)),
    validateListing;

router.get("/new", isLoggedIn, listingController.newRoute);

router
    .route("/:id")
    .get(wrapAsync(listingController.showRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyRoute))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateRoute));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;