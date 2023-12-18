const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", isAuth, userController.getUsers);

router.get("/me", isAuth, userController.getMe);

router.patch("/me", isAuth, fileUpload.fields([
    { name: "image", maxCount: 12 },
    { name: "docs", maxCount: 12 },
]), userController.editUser);


module.exports = router;