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


    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-validate hook to generate slug (runs before validation)
plotSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    // Generate base slug
    let slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    // Ensure uniqueness
    try {
      const existingPlot = await mongoose.models.Plot.findOne({ slug: slug, _id: { $ne: this._id } });
      if (existingPlot) {
        slug = `${slug}-${Date.now()}`;
      }
      this.slug = slug;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Plot = mongoose.model("Plot", plotSchema);
module.exports = Plot;
