const express = require("express");
const router = express.Router();

const addPatientRoutes = require("./addPatientRoutes");
const uploadRoutes = require("./uploadRoutes");

router.use("/", addPatientRoutes);
router.use("/", uploadRoutes);

module.exports = router;
