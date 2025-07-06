const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const userController = require("../controller/user");

router.route("/signUp")
    .get(userController.signUpRender)
    .post(userController.signUp);

router.route("/login")
    .get(userController.loginRender)
    .post(
        savedRedirectUrl,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        userController.login
    );

router.get("/logout", userController.logOut);

module.exports = router;