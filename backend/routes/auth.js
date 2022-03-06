const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { body, validator, validationResult } = require("express-validator");

// Create a user using:POST "/routes/auth". Doesn't require Auth
router.post(
  "/",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name(min->3)").isLength({ min: 3 }),
    body("phone", "Enter a valid phone(min->10)").isLength({ min: 10 }),
    body("password", "Enter a valid password(min->5)").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user = await User.findOne({ email: req.body.email });
      let phone = await User.findOne({ phone: req.body.phone });
      if (phone) {
        return res
          .status(400)
          .json({ errors: "A user with this phone number already exists" });
      }
      if (user) {
        return res
          .status(400)
          .json({ error: "A user with this email already exists" });
      }
      User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      })
        .then((user) => res.json(user))
        .catch((err) => {
          console.log(err);
          res.json({
            error: "please enter a unique user value",
            message: err.message,
          });
        });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


module.exports = router;
