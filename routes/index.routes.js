const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const File = require("../models/file.model");

const views = ["drive", "recent", "starred", "trash"];

router.get("/", (req, res) => {
  res.redirect("/home");
});

// One page, four lists. ?view= picks which files to load.
router.get("/home", authMiddleware, async (req, res) => {
  try {
    const view = views.includes(req.query.view) ? req.query.view : "drive";
    const owner = req.user.userID;

    // $ne: true also matches older files that were saved before the trashed field existed
    let filter = { owner, trashed: { $ne: true } };

    if (view === "trash") {
      filter = { owner, trashed: true };
    }

    if (view === "starred") {
      filter = { owner, trashed: { $ne: true }, starred: true };
    }

    let query = File.find(filter).sort({ createdAt: -1 });

    // Recent is the same as My Drive, just the latest 10
    if (view === "recent") {
      query = query.limit(10);
    }

    const files = await query;

    res.render("home", {
      files,
      user: req.user,
      view,
      error: req.query.error || "",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not load your files.");
  }
});

module.exports = router;
