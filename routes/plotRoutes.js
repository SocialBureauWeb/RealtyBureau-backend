const express = require("express");
const plotController = require("../controllers/plotController");
const plotRoutes = express.Router();

plotRoutes.post('/add', plotController.createPlot);
plotRoutes.get("/", plotController.listPlots); // ✅ Gets all plots
plotRoutes.get("/:id", plotController.getPlotById);
plotRoutes.patch("/update/:id", plotController.updatePlot);
plotRoutes.delete("/delete/:id", plotController.deletePlot);
plotRoutes.patch("/approve/:id", plotController.approvePlot);

module.exports = plotRoutes;

