const Listing = require("./model/listing");
const Review = require("./model/review")
const reviewSchema = require("./model/review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next()
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next()
    }
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are the not owner of this list!");
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewID } = req.params;
    let review = await Review.findById(reviewID);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are the not owner of this list!");
        return res.redirect(`/listing/${id}`)
    }
    next();
}