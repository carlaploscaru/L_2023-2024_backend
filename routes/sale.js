const express = require("express");
const isAuth = require("../middleware/is-auth");
const saleControler = require("../controllers/sale")

const router = express.Router();

router.post("/",isAuth, saleControler.addSale);

module.exports = router;