const express = require("express");
const app = express();
const port = process.env.PORT || 9000;

const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./model/user.js");

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/traveling";

const listingRouter = require("./router/listings.js");
const reviewRouter = require("./router/reviews.js");
const UserRouter = require("./router/users.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

main().then(() => {
    console.log("✅ connected to mongoDB");
}).catch((err) => {
    console.log("❌ MongoDB connection error:", err);
});

async function main() {
    await mongoose.connect(dbURL);
}

app.use(session({
    secret: process.env.SECRET || "fallbackSecretKey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dbURL,
        collectionName: "sessions"
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", UserRouter);

app.use((err, req, res, next) => {
    let { status = 500, message = "Other error occurred" } = err;
    res.status(status).render("./listing/error.ejs", { err });
});

app.get("/", (req, res) => {
    res.redirect("/listing");
});

app.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
    console.log(`🌐 Visit: http://localhost:${port}`);
});