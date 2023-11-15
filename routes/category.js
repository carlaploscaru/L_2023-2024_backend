const express = require("express");
const categoryController = require("../controllers/category");

const router = express.Router();

router.post("/add-category", categoryController.addCategory);
router.get("/get-category", categoryController.getCategories);
module.exports = router;