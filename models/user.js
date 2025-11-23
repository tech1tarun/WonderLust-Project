const { required } = require("joi");
const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

//why we are using plugin here
//passportLocalMingoose by default automatically define usertname and password by itself
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
