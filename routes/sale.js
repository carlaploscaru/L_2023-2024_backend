const express = require("express");
const isAuth = require("../middleware/is-auth");
const saleControler = require("../controllers/sale")
const { body } = require("express-validator");

const router = express.Router();

router.post("/", isAuth,
    [
        body("data_start")
            .isLength({ min: 3 })
            .withMessage("Data start can't be empty!"),
        body("data_end")
            .isLength({ min: 3 })
            .withMessage("Data end can't be empty!"),

        body("nume")
            .isLength({ min: 3 })
            .withMessage("Name can't be empty!"),
        body("adresa")
            .isLength({ min: 3 })
            .withMessage("Adress can't be empty!"),
        body("telefon")
            .isLength({ min: 3 })
            .withMessage("Phone number can't be empty!"),
    ], saleControler.addSale);

router.get(
    "/", isAuth, saleControler.getSalesByUserId
);

router.get(
    "/clients", isAuth, saleControler.getClientsByOwnerId
);

module.exports = router;