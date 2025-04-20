const review = require("../model/review");
const Listing = require("../model/listing.js");

module.exports.createRoute = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "Review added successfully!");

    res.redirect(`/listing/${req.params.id}`)

    console.log(newReview);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewID } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
    await review.findByIdAndDelete(reviewID);
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listing/${id}`);
};