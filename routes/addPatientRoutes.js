const express = require("express");
const router = express.Router();
const { addPatient } = require("../controllers/addPatientController");

router.post("/addPatient", addPatient);

module.exports = router;
