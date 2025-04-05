const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./model/listing");
const path = require("path");
const ejsMate = require("ejs-mate");
const app = express();
const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

main().then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/traveling');
}

//root route
app.get("/", (req, res) => {
    res.send("root is working")
})

//index route
app.get("/listing", async (req, res) => {
    let listing = await Listing.find({});
    res.render("./listing/index.ejs", { listing });
});

//new route
app.get("/listing/new", (req, res) => {
    res.render("listing/new.ejs");
});

//create route
app.post("/listing", async (req, res) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect(`/listing`);
})

//show route
app.get("/listing/:id", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).then((listing) => {
        res.render("./listing/show.ejs", { listing })
    });
});

//delete route
app.delete("/listing/:id", (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndDelete(id).then(() => {
        res.redirect("/listing")
    }).catch((err) => {
        console.log(err);
    })
})

//edit route
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
})

//update route
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listing/${id}`)
})

//listening port
app.listen(port, () => {
    console.log("server started on port", port);
})