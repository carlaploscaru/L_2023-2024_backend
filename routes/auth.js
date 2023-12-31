const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator/check");
const { User } = require("../models/user");
const { isEmpty } = require("lodash");

const router = express.Router();

router.post("/signup", [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email already exists!");
        }
      });
    })
    .normalizeEmail({ gmail_remove_dots: false }),
  body("repeatPassword")
    .custom((value, { req }) => {
      if (!value) {
        return Promise.reject("Repeat password cannot be empty");
      }

      if (value !== req.body.password) {
        return Promise.reject("Repeat password does not match password");
      }

      return true;
    }),

  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password must be minimum of 5 characters"),
  body("name").trim().not().isEmpty().withMessage("Name cannot be empty"),
], authController.signup);





router.post("/login", [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail({ gmail_remove_dots: false }),
], authController.login)




router.post("/confirm-account-registry", [
  body("registryToken")
    .isLength({ min: 5 })
    .withMessage("Pease enter a valid registration token!")
], authController.confirmAccount);



router.post("/reset", [
  body("email")
    .isLength({ min: 3 })
    .withMessage("Please enter a valid email ghggg")
    .custom((value, { req }) => {
      return User.findOne({ where: { email: value } }).then((userDoc) => {
        if (body("email").isEmail()) {
          return true
        }
        if (!userDoc) {
          return Promise.reject("Email not found!");
        }
      });
    }),], authController.resetPassword);



router.post(
  "/new-password",
  [
    body("resetToken")
      .isLength({ min: 5 })
      .withMessage("Please enter a valid token!"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password must be minimum of 5 characters"),
    body("repeatPassword").custom((value, { req }) => {
      if (!value) {
        return Promise.reject("Repeat password cannot be empty");
      }

      if (value !== req.body.password) {
        return Promise.reject("Repeat password does not match password");
      }

      return true;
    }),


  ],
  authController.postNewPassword
);

module.exports = router;





