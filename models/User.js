const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false, // Not required for Google users
    },

    googleId: {
      type: String,
      required: false, // For Google login users
    },

    picture: {
      type: String,
      required: false, // Google profile picture or manual profile picture
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plot",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
