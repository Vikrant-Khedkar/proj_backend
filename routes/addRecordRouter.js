const express = require("express");
const router = express.Router();
const { addRecord } = require("../controllers/addRecordController");

router.post("/addRecord",addRecord);

module.exports = router;
