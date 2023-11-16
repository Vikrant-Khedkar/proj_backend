const express = require("express");
const router = express.Router();

const addPatientRoutes = require("./addPatientRoutes");
const uploadRoutes = require("./uploadRoutes");
const addRecordRoutes = require("./addRecordRouter");

router.use("/", addPatientRoutes);
router.use("/", uploadRoutes);
router.use("/",addRecordRoutes);

module.exports = router;
