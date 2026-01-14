const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { route } = require("./listing");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");
const user = require("../models/user");

router
  .route("/signup")
  .get(userController.renderSignupForm) //signup form route
  .post(wrapAsync(userController.signup)); //signup route

router
  .route("/login")
  .get(userController.renderLoginForm) //login form route
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  ); //passport.authenticate() is the middleware which automatically verify the user from the database that user is authenticate or not
//logged in route

//logout route
router.get("/logout", userController.logout);

module.exports = router;
