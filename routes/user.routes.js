const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Send the person back to the form with a message the page can print
function redirectWith(res, path, key, message) {
  res.redirect(`${path}?${key}=${encodeURIComponent(message)}`);
}

router.get("/register", (req, res) => {
  res.render("register", {
    error: req.query.error || "",
    notice: req.query.notice || "",
  });
});

router.post(
  "/register",
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name is too short."),
  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name is too short."),
  body("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters."),
  body("email").trim().isEmail().withMessage("Enter a valid email."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return redirectWith(
        res,
        "/user/register",
        "error",
        errors.array()[0].msg,
      );
    }

    const {
      first_name,
      last_name,
      username,
      email,
      password,
      confirm_password,
    } = req.body;

    // The browser also checks this. This is the backup if JavaScript is off.
    if (password !== confirm_password) {
      return redirectWith(
        res,
        "/user/register",
        "error",
        "Passwords do not match.",
      );
    }

    try {
      const hashPassword = await bcrypt.hash(password, 10);

      await userModel.create({
        first_name,
        last_name,
        username,
        email,
        password: hashPassword,
      });

      return redirectWith(
        res,
        "/user/login",
        "notice",
        "Account created. Log in to open your drive.",
      );
    } catch (error) {
      // 11000 means email or username is already taken
      if (error.code === 11000) {
        return redirectWith(
          res,
          "/user/register",
          "error",
          "That email or username is already used.",
        );
      }

      console.log(error);
      return redirectWith(
        res,
        "/user/register",
        "error",
        "Could not create the account.",
      );
    }
  },
);

router.get("/login", (req, res) => {
  res.render("login", {
    error: req.query.error || "",
    notice: req.query.notice || "",
  });
});

router.post(
  "/login",
  body("email").trim().isEmail().withMessage("Enter a valid email."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return redirectWith(res, "/user/login", "error", errors.array()[0].msg);
    }

    const { email, password } = req.body;
    const remember = req.body.remember === "on";

    const user = await userModel.findOne({ email });

    // Same message either way, so we do not reveal which emails exist
    if (!user) {
      return redirectWith(
        res,
        "/user/login",
        "error",
        "Email or password is incorrect.",
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return redirectWith(
        res,
        "/user/login",
        "error",
        "Email or password is incorrect.",
      );
    }

    // first_name is here so the home page can show an avatar without another database read.
    // The password hash is never put in the token.
    const token = jwt.sign(
      {
        userID: user._id.toString(),
        first_name: user.first_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: remember ? "30d" : "1d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    // Checked "Remember me" keeps the cookie for 30 days. Otherwise it ends when the browser closes.
    if (remember) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    res.cookie("token", token, cookieOptions);
    res.redirect("/home");
  },
);

// Must be logged in to log out, then the cookie is removed
router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login");
});

module.exports = router;
