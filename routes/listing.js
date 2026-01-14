const express = require("express");
const router = express.Router();
const wrapAsyn = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsyn(listingController.index)) //Index Route
  .post(isLoggedIn, validateListing, wrapAsyn(listingController.createListing)); //Create Route

//New route
//It must be placed after the route with :id to avoid conflicts (before it would treat "new" as an id)
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsyn(listingController.showListing)) //Show Route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsyn(listingController.updateListing) //Update Route
  )
  .delete(isLoggedIn, isOwner, listingController.deleteListing); //Delete Route

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsyn(listingController.editListing)
);

module.exports = router;
