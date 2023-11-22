const { Place } = require("../models/place");
const { Category } = require("../models/category");

/*exports.addPlace = async (req, res, next) => {
    try {

        let place = await Place.findOne({ name: req.body.name });

        

        
        console.log(place);
        if (place) {
            return res.status(400).send({ message: "Place already exixts" });
        }

        if (!req.body.name) {
            const error = new Error("Name cannot be empty");
            error.statusCode = 405;
            throw error;
        }  
        
        if (!req.body.location_coord) {
            const error = new Error("Location cannot be empty");
            error.statusCode = 422;
            throw error;
        }

        if (!req.body.status) {
            const error = new Error("Status cannot be empty");
            error.statusCode = 405;
            throw error;
        }
  
        if (req.body.name==req.body.previousN && (req.body.location_coord !== previousL )) {
            const error = new Error("diferent location");
            error.statusCode = 401;
            throw error;
        }
        



        const name = req.body.name;
        const location_coord = req.body.location_coord;
        const surface = req.body.surface;
        const country = req.body.country;
        const city = req.body.city;
        const street = req.body.street;
        const number = req.body.number;
        const apartment = req.body.apartment;
        const status = req.body.status;

        place = new Place({ name: name, location_coord: location_coord, surface:surface, country: country, city: city, street:street,number: number, apartment: apartment, status:status });

        await place.save();

        res.status(200).send(place._id);
    } catch (error) {
        next(error);
    }

};*/


exports.addPlace = async (req, res, next) => {
    try {
        const category = await Category.findById(req.body.categoryId);

        if (!category) {
            const error = new Error("Category does not exist!");
            error.statusCode = 401;
            throw error;
        }

        let place = new Place({
            title: req.body.title,
            suprafata: req.body.suprafata,
            tara: req.body.tara,
            oras: req.body.oras,
            judet: req.body.judet,
            strada: req.body.strada,
            category: { _id: category._id, title: category.title },
            owner: req.userId
        });
        await place.save();

        res.status(200).send(place);
    } catch (error) {
        next(error);
    }
};


exports.getPlaces = async (req, res, next) => {
    let places = [];

    try {
        places = await Place.find();

        res.status(200).send({ places: places });
    } catch (error) {
        next(error)
    }
};

exports.editPlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    try {
        const place = await Place.findById(placeId);
        const oldPlace = place;

        if (req.body.categoryId) {
            const category = await Category.findById(req.body.categoryId);
            place.category = { _id: category._id, title: category.title }
        }

        if (!place) {
            const error = new Error("Place does not exist!");
            error.statusCode = 403;
            throw error;
        }



        if (place.owner._id.valueOf() !== req.userId) {
            const error = new Error("Not authorized for this asset!");
            error.statusCode = 422;
            throw error;
        }

        place.title = req.body.title || oldPlace.title;
        place.suprafata = req.body.suprafata || oldPlace.suprafata;
        place.tara = req.body.tara || oldPlace.tara;
        // place.oras = req.body.oras || oldPlace.oras;
        place.judet = req.body.judet || oldPlace.judet;
        // place.strada = req.body.starda || oldPlace.strada;

        await place.save();

        res.status(200).send(place);

    } catch (error) {
        next(error);
    }
}