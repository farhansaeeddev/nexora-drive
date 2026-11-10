const mongoose = require("mongoose");

// One document per uploaded file. The bytes live in /uploads; this is the metadata.
const fileSchema = new mongoose.Schema(
  {
    // Name the person picked, shown in the file list
    originalName: {
      type: String,
      required: true,
    },
    // Random name on disk so two "notes.pdf" uploads do not overwrite each other
    storedName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    // Logged-in user who owns this file
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    // Soft delete: the file stays on disk until "delete forever"
    trashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("File", fileSchema);
