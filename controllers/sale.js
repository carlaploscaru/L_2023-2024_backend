const { validationResult } = require("express-validator");
const { Place } = require("../models/place");
const { Sale } = require("../models/sales");
const { Category } = require("../models/category");
const { User } = require("../models/user");

exports.addSale = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Booking failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const place = await Place.findById(req.body.placeId);

    if (Date.parse(req.body.data_start) > Date.parse(req.body.data_end)) {
      const error = new Error("Ending date must be smaler than staring date!");
      error.statusCode = 422;
      throw error;
    }

    if (!place) {
      const error = new Error("There is no place for this id");
      error.statusCode = 401;
      throw error;
    }

    

    const sales = await Sale.find({ place: place._id });

    let date_begin = new Date(req.body.data_start);
    let date_end = new Date(req.body.data_end);
    let differenceInTime = date_end.getTime() - date_begin.getTime();
    let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));



    sales.map(sale => {

      const ds = new Date(sale.data_start);
      const de = new Date(sale.data_end);
      const ds_req = new Date(req.body.data_start);
      const de_req = new Date(req.body.data_end);


      if (
        (ds_req.getTime() <= ds.getTime() && de_req.getTime() > de.getTime()) ||
        (ds_req.getTime() <= ds.getTime() && de_req.getTime() < de.getTime() && de_req.getTime() > ds.getTime()) ||
        (ds_req.getTime() >= ds.getTime() && ds_req.getTime() < de.getTime() && de_req.getTime() > ds.getTime())
      ) {
        const error = new Error("The solicitated date is not available");
        error.statusCode = 401;
        throw error;
      }
    });

    let sale = new Sale({
      client: req.userId,
      place: req.body.placeId,
      owner: place.owner,
      data_start: req.body.data_start,
      data_end: req.body.data_end,
      price: differenceInDays * place.price,

      nume: req.body.nume,
      adresa: req.body.adresa,
      telefon: req.body.telefon,
      pay_type: req.body.pay_type,
    });
   

   

    await sale.save();

    res.status(200).send(sale);
  } catch (error) {
    next(error);
  }
};

exports.getSalesByUserId = async (req, res, send) => {

  const reservations = await Sale.find({ client: req.userId })

  let revzToSend = await Promise.all(
    reservations.map(async (rezv) => {
      let place = await Place.findById(rezv.place);
      let category = await Category.findById(place.category);
      let owner = await User.findById(place.owner);


      return {
        _id: rezv._id,
        place: place.title,
        data_start: rezv.data_start,
        data_end: rezv.data_end,
        suprafata: place.suprafata,
        category: category.title,
        tara: place.tara,
        oras: place.oras,
        judet: place.judet,
        strada: place.strada,
        price: rezv.price || "",
        currency: place.currency || "",
        owner: owner.name,
        image: place.image,
      };
    })
  );
  res.status(200).send({ reservations: revzToSend });

}


exports.getClientsByOwnerId = async (req, res, send) => {
  const place = await Place.find({ owner: req.userId })
  const reservations = await Sale.find({ owner: req.userId })

  let revzToSend = await Promise.all(
    reservations.map(async (rezv) => {
      let place = await Place.findById(rezv.place);
      let category = await Category.findById(place.category);
      let client = await User.findById(rezv.client);//client din models sales


      return {
        _id: rezv._id,
        place: place.title,
        data_start: rezv.data_start,
        data_end: rezv.data_end,
        suprafata: place.suprafata,
        category: category.title,
        tara: place.tara,
        oras: place.oras,
        judet: place.judet,
        strada: place.strada,
        price: rezv.price || "",
        currency: place.currency || "",
        image: place.image,
        client: client.name,
      };
    })
  );
  res.status(200).send({ clients: revzToSend });
}