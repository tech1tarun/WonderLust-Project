require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { geocoding, config } = require("@maptiler/client");

config.apiKey = process.env.MAP_TOKEN;

mongoose.connect(process.env.MONGO_URL);

async function fixListings() {
  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { "geometry.coordinates": { $exists: false } },
    ],
  });

  console.log(`Fixing ${listings.length} listings...`);

  for (let listing of listings) {
    const query = listing.location || "Delhi";

    const geo = await geocoding.forward(query);

    if (geo.features && geo.features.length > 0) {
      listing.geometry = {
        type: "Point",
        coordinates: geo.features[0].geometry.coordinates,
      };
      await listing.save();
      console.log(`✔ Fixed: ${listing.title}`);
    } else {
      console.log(`✘ Failed: ${listing.title}`);
    }
  }

  mongoose.connection.close();
}

fixListings();
