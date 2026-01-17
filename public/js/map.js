// ---- Config ----
maptilersdk.config.apiKey = MapToken;

// ---- Create Map ----
const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, // [lng, lat]
  zoom: 10,
});

// ---- Add Marker ----
new maptilersdk.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new maptilersdk.Popup({
      closeButton: false,
      closeOnClick: false,
    }).setHTML(
      `<i><h3>${listingLocationName}</h3></i><p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
