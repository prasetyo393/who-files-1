const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/cloudDrive");

const FileSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model("File", FileSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
    const file = new File({
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
    });
    await file.save();
    res.json({ message: "File uploaded!" });
});

app.get("/files", async (req, res) => {
    const files = await File.find().sort({ uploadDate: -1 });
    res.json(files);
});

app.get("/download/:filename", (req, res) => {
    res.download(path.join(__dirname, "uploads", req.params.filename));
});

app.delete("/delete/:id", async (req, res) => {
    const file = await File.findById(req.params.id);
    fs.unlinkSync(path.join(__dirname, "uploads", file.filename));
    await file.deleteOne();
    res.json({ message: "File deleted!" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
