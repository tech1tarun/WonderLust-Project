require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpreeEror.js");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const PORT = 8080;

// ================= ENV =================
const dbURL = process.env.ATLASDB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!dbURL) throw new Error("ATLASDB_URL missing");
if (!SESSION_SECRET) throw new Error("SESSION_SECRET missing");

// ================= DB =================
mongoose
  .connect(dbURL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= APP CONFIG =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= SESSION (connect-mongo v4) =================
const store = MongoStore.create({
  mongoUrl: dbURL,
  secret: SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("❌ SESSION STORE ERROR:", err);
});

app.use(
  session({
    store,
    name: "session",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // 🔴 CRITICAL FIX
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= LOCALS =================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ================= ROUTES =================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ================= 404 =================
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  return res.status(statusCode).render("error.ejs", { message });
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
