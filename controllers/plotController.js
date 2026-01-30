const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");
const Plot = require("../models/plotModel");

function sendError(res, status = 400, message = "Bad Request", details = null) {
  const payload = { success: false, message };
  if (details) payload.details = details;
  return res.status(status).json(payload);
}

const plotController = {
  createPlot: expressAsyncHandler(async (req, res) => {
    try {
      const { title, description, plotSize, price, location, images, videos, category, status, postedBy } =
        req.body;

      // Validate required fields
      if (!title || title.trim() === '') return sendError(res, 400, "Title is required");
      if (!description || description.trim() === '') return sendError(res, 400, "Description is required");
      if (!plotSize || plotSize.value === '' || plotSize.value === undefined || plotSize.value === null)
        return sendError(res, 400, "Plot size value is required");
      if (!plotSize.unit || plotSize.unit.trim() === '') return sendError(res, 400, "Plot size unit is required");
      if (!price || price === '' || price === undefined || price === null) return sendError(res, 400, "Price is required");
      if (!category || category.trim() === '') return sendError(res, 400, "Category is required");

      // Validate plotSize unit
      if (!["sqft", "cent"].includes(plotSize.unit)) {
        return sendError(res, 400, "Plot size unit must be 'sqft' or 'cent'");
      }

      // Create new plot with all fields
      const newPlot = new Plot({
        title,
        description,
        plotSize: {
          value: Number(plotSize.value),
          unit: plotSize.unit,
        },
        price: Number(price),
        location: location || {},
        images: images || [],
        videos: videos || [],
        category,
        status: status || "Available",
        postedBy: postedBy || null,
      });

      const savedPlot = await newPlot.save();
      return res.status(201).json({ success: true, data: savedPlot });
    } catch (err) {
      console.error("createPlot error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // Get Single Plot by ID or Slug
  getPlotById: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      let plot;

      // Try finding by ID if it looks like one, otherwise treat as slug
      if (mongoose.Types.ObjectId.isValid(id)) {
        plot = await Plot.findOne({
          $or: [
            { _id: id },
            { slug: id }
          ]
        }).lean();
        console.log("1st if", plot);
      } else {
        plot = await Plot.findOne({ slug: id }).lean();
        console.log("2nd if", plot);
      }

      if (!plot) return sendError(res, 404, "Plot not found");

      return res.json({ success: true, data: plot });
    } catch (err) {
      console.error("getPlotById error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // List Plots with Filters
  listPlots: expressAsyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        approved,
        status,
        category,
        city,
        minPrice,
        maxPrice,
        sort = "-createdAt",
      } = req.query;

      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));
      const filter = {};

      if (approved !== undefined) {
        filter.approved = String(approved) === "true";
      }

      if (status) filter.status = status;
      if (category) filter.category = category;
      if (city) filter["location.city"] = new RegExp(city, "i");

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const sortStr = typeof sort === 'string' ? sort : "-createdAt";
      const skip = (p - 1) * l;

      const [items, total] = await Promise.all([
        Plot.find(filter)
          .sort(sortStr)
          .skip(skip)
          .limit(l)
          .lean(),
        Plot.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        meta: { page: p, limit: l, total, pages: Math.ceil(total / l) },
        data: items,
      });

    }
    catch (err) {
      console.error("listPlots error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // Update Plot
  updatePlot: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return sendError(res, 400, "Invalid plot id");

      const updateData = { ...req.body };
      if (updateData.plotSize && typeof updateData.plotSize === 'object') {
        if (!updateData.plotSize.unit || !["sqft", "cent"].includes(updateData.plotSize.unit)) {
          return sendError(res, 400, "Invalid plot size unit");
        }
        updateData.plotSize.value = Number(updateData.plotSize.value);
      }

      const updated = await Plot.findByIdAndUpdate(id, updateData, {
        new: true,
      }).lean();

      if (!updated) return sendError(res, 404, "Plot not found");

      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error("updatePlot error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // Delete Plot
  deletePlot: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return sendError(res, 400, "Invalid plot id");

      const deleted = await Plot.findByIdAndDelete(id).lean();
      if (!deleted) return sendError(res, 404, "Plot not found");

      return res.json({ success: true, data: deleted });
    } catch (err) {
      console.error("deletePlot error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // Approve Plot
  approvePlot: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return sendError(res, 400, "Invalid plot id");

      const updated = await Plot.findByIdAndUpdate(
        id,
        { approved: true },
        { new: true }
      ).lean();

      if (!updated) return sendError(res, 404, "Plot not found");

      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error("approvePlot error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),
};

module.exports = plotController;
