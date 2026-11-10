const path = require("path");
const express = require("express");

// Load .env before anything reads MONGO_URI or JWT_SECRET
require("dotenv").config();

const connectToDb = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");
const fileRouter = require("./routes/file.routes");

connectToDb();

const app = express();

app.set("view engine", "ejs");

// These have to run before routes, or req.body and req.cookies are empty
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Download URLs are /files/<storedName>
app.use("/files", express.static(path.join(__dirname, "uploads")));

app.use("/file", fileRouter);
app.use("/user", userRouter);
app.use("/", indexRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
