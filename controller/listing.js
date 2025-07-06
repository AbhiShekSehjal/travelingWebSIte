const mongoose = require("mongoose");
const Listing = require("../model/listing.js");

module.exports.indexRoute = async (req, res) => {
    let listings = await Listing.find({});
    res.render("./listing/index.ejs", { listings });
}

module.exports.newRoute = (req, res) => {
    res.render("./listing/new.ejs");
}

module.exports.createRoute = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id;
        listing.image = { url, filename };

        await listing.save();
        req.flash("success", "New listing added successfully!");
        res.redirect(`/listing/${listing._id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to create listing");
        res.redirect("/listing");
    }
};

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

    // if (!mongoose.isValidObjectId(id)) {
    //     return res.status(400).json({ message: 'Invalid listing ID' });
    // }

    // try {
    //     const deletedListing = await Listing.findByIdAndDelete(id);
    //     if (!deletedListing) {
    //         return res.status(404).json({ message: 'Listing not found' });
    //     }
    //     res.status(200).json({ message: 'Listing deleted successfully' });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

    await Listing.findByIdAndDelete(id).then(() => {
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listing")
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.editRoute = async (req, res) => {

    // const { id } = req.params;

    // if (!mongoose.isValidObjectId(id)) {
    //     return res.status(400).json({ message: 'Invalid listing ID' });
    // }

    // try {
    //     const listing = await Listing.findById(id);
    //     if (!listing) {
    //         return res.status(404).json({ message: 'Listing not found' });
    //     }
    //     res.status(200).json(listing);
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

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

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "invalid listing id" });
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedListing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).json(updatedListing);  // 👈 You already send JSON response here
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`./listing/${id}`);
};