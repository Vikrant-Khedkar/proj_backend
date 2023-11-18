const express = require("express");
const router = express.Router();
const { addRecord } = require("../controllers/addRecordController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post("/addRecord", upload.single("file"), addRecord);

module.exports = router;
