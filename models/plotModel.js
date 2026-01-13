const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    plotSize: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["sqft", "cent"],
        default: "sqft",
        required: true,
      },
    },

    price: {
      type: Number, // total plot price or per sq.ft (your choice)
      required: true,
    },

    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String },
    },

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],

    videos: [
      {
        url: { type: String, required: true },
        thumbnail: { type: String },
        duration: { type: Number }, // in seconds
        alt: { type: String },
      },
    ],

    category: {
      type: String,
      enum: ["Residential", "Commercial"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },

    approved: {
      type: Boolean,
      default: false, // Admin approval before listing
    },

    // postedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true, // Agent / Admin / Owner ID
    // },
  },
  { timestamps: true }
);

const Plot = mongoose.model("Plot", plotSchema);
module.exports = Plot;
