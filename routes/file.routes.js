const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const File = require("../models/file.model");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Every file route needs a logged-in user
router.use(authMiddleware);

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Write the file into /uploads with a unique stored name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "application/pdf",
      "text/plain",
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.rar",
      "application/x-rar-compressed",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("That file type is not allowed."));
    }
  },
});

// Only allow a return path inside this app, so a form cannot redirect elsewhere
function backTo(req) {
  const nextUrl = req.body && req.body.returnTo;

  if (typeof nextUrl === "string" && nextUrl.startsWith("/home") && !nextUrl.startsWith("//")) {
    return nextUrl;
  }

  return "/home";
}

async function findOwnedFile(req) {
  return File.findOne({
    _id: req.params.id,
    owner: req.user.userID,
  });
}

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect("/home?error=" + encodeURIComponent("Please select a file."));
    }

    await File.create({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      owner: req.user.userID,
    });

    res.redirect("/home");
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    console.log("Upload error:", error);
    res.redirect("/home?error=" + encodeURIComponent("File upload failed."));
  }
});

// Flip the star on and off
router.post("/star/:id", async (req, res) => {
  try {
    const file = await findOwnedFile(req);

    if (!file) {
      return res.status(404).send("File not found.");
    }

    file.starred = !file.starred;
    await file.save();
    res.redirect(backTo(req));
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not update the star.");
  }
});

// Hide the file from My Drive. The bytes stay until a permanent delete.
router.post("/trash/:id", async (req, res) => {
  try {
    const file = await findOwnedFile(req);

    if (!file) {
      return res.status(404).send("File not found.");
    }

    file.trashed = true;
    await file.save();
    res.redirect(backTo(req));
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not move the file to trash.");
  }
});

router.post("/restore/:id", async (req, res) => {
  try {
    const file = await findOwnedFile(req);

    if (!file) {
      return res.status(404).send("File not found.");
    }

    file.trashed = false;
    await file.save();
    res.redirect(backTo(req));
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not restore the file.");
  }
});

// Removes the database row and the file in /uploads
async function hardDelete(req, res) {
  try {
    const file = await findOwnedFile(req);

    if (!file) {
      return res.status(404).send("File not found.");
    }

    const filePath = path.join(uploadDir, path.basename(file.storedName));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await file.deleteOne();
    res.redirect(backTo(req));
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not delete the file.");
  }
}

router.post("/delete/:id", hardDelete);
router.post("/permanent-delete/:id", hardDelete);

// Multer reports "too big" and "wrong type" as errors. Send the person back to the drive.
router.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  const message =
    err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 10 MB)." : err.message || "Upload failed.";

  res.redirect("/home?error=" + encodeURIComponent(message));
});

module.exports = router;
