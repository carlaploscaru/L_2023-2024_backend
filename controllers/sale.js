const { Place } = require("../model/place");
const { Sale } = require("../model/sales");

exports.addSale = async (req, res, next) => {
  try {
    const place = Place.findById(req.body.placeId);

    if (!place) {
      const error = new Error("There is no place for this id");
      error.statusCode = 401;
      throw error;
    }

    let sale = new Sale({
      client: req.userId,
      place: req.body.placeId,
      data_start: req.body.data_star,
      data_end: req.body.data_end,
    });
    await sale.save();

    res.status(200).send(sale);
  } catch (error) {
    next(error);
  }
};