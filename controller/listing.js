const Listing = require("../model/listing.js");

module.exports.indexRoute = async (req, res) => {
    let listing = await Listing.find({});
    res.render("./listing/index.ejs", { listing });
}

module.exports.newRoute = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.createRoute = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { url, filename }

    await listing.save();

    req.flash("success", "New listing added successfully!");
    res.redirect(`/listing`);
}

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you reqested for does not exist!");
        return res.redirect("/listing");
    }
    // console.log(listing);
    res.render("./listing/show.ejs", { listing })
}

module.exports.destroyRoute = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then(() => {
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listing")
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you reqested for does not exist!");
        return res.redirect("/listing");
    }
    res.render("./listing/edit.ejs", { listing });
}

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listing/${id}`)
}