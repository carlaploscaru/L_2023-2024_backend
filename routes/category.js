const express = require("express");
const categoryController = require("../controllers/category");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();


router.get("/", categoryController.getCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.post("/", isAuth, isAdmin, categoryController.addCategory);
router.patch("/:categoryId", isAdmin, isAuth, categoryController.editCategory);
module.exports = router;