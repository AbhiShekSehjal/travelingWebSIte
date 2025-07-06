const User = require("../model/user");

module.exports.signUpRender = (req, res) => {
    res.render("user/signUp.ejs");
};

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.logIn(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Tripverse!");
            res.redirect("/listing");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signUp");
    }
};

module.exports.loginRender = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back on Tripverse!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logout successfully!");
        res.redirect("/listing");
    });
};
