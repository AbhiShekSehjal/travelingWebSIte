const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const app = express();
const port = 8080;
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStatergy = require("passport-local");
const User = require("./model/user.js");

const dbURL = "mongodb+srv://shek54112:4bAzj5mRqa1UT4FL@cluster0.oieuxe5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// app.get('/', (req, res) => {
//     res.send('Hello World!'); // Or render a file
//   });

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
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}

app.use(session({
    secret: "yourSecretKey",
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
passport.use(new localStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    // res.locals.owner = req.user;
    next();
})
app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", UserRouter);

//custom error handler middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "other error occured" } = err;
    res.render("./listing/error.ejs", { err });
    res.status(status);
})

//listening port
app.listen(port, () => {
    console.log("server started on port", port);
})