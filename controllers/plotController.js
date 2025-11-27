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
      const { title, description, plotSize, price, location, images, videos, category } =
        req.body;

      if (!title || !description || !plotSize || !price || !category)
        return sendError(res, 400, "Required fields missing");

      const newPlot = new Plot({
        title,
        description,
        plotSize,
        price,
        location,
        images,
        videos,
        category,
        approved: false, // pending approval
      });

      const savedPlot = await newPlot.save();
      return res.status(201).json({ success: true, data: savedPlot });
    } catch (err) {
      console.error("createPlot error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // ✅ Get Single Plot (GET /plots/:id)
  getPlotById: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return sendError(res, 400, "Invalid plot id");

      const plot = await Plot.findById(id)
        .lean();

      if (!plot) return sendError(res, 404, "Plot not found");

      return res.json({ success: true, data: plot });
    } catch (err) {
      console.error("getPlotById error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // ✅ List Plots with Filters (GET /plots)
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

      if (approved !== undefined)
        filter.approved = approved === "true" ? true : false;

      if (status) filter.status = status;
      if (category) filter.category = category;
      if (city) filter["location.city"] = new RegExp(city, "i");
      if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
      if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

      const skip = (p - 1) * l;

      const [items, total] = await Promise.all([
        Plot.find(filter)
          .sort(sort)
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
    } catch (err) {
      console.error("listPlots error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // ✅ Update Plot (PATCH /plots/:id)
  updatePlot: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return sendError(res, 400, "Invalid plot id");

      const updated = await Plot.findByIdAndUpdate(id, req.body, {
        new: true,
      })
        .lean();

      if (!updated) return sendError(res, 404, "Plot not found");

      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error("updatePlot error", err);
      return sendError(res, 500, "Internal server error", err.message);
    }
  }),

  // ✅ Delete Plot (DELETE /plots/:id)
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

  // ✅ Approve Plot (PATCH /plots/:id/approve)
  approvePlot: expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return sendError(res, 400, "invalid plot id");

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
