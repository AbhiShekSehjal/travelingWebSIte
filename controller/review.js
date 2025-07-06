const Review = require("../model/review");
const Listing = require("../model/listing.js");

module.exports.createRoute = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        await newReview.save();
        listing.review.push(newReview);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listing/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to add review!");
        res.redirect("/listing");
    }
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewID } = req.params;

    try {
        await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
        await Review.findByIdAndDelete(reviewID);

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to delete review!");
        res.redirect(`/listing/${id}`);
    }
};