const express=require("express");
const plotRoutes = require("./plotRoutes");
const uploadRoutes = require("./uploadRoutes");
const router=express()

router.use(express.json())

router.use("/plot", plotRoutes);
router.use("/upload", uploadRoutes);

module.exports=router