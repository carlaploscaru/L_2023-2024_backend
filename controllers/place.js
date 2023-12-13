const { Place } = require("../models/place");
const { Category } = require("../models/category");
const { User } = require("../models/user");
const { validationResult } = require("express-validator");


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
    const errors = validationResult(req);
    let picsArray = [];
    let docsArray = [];
    let docsNameArray = [];


    try {
        const category = await Category.findById(req.body.categoryId);


        // if (!category) {
        //     const error = new Error("Category does not exist!");
        //     error.statusCode = 401;
        //     throw error;
        // }



        // if (!errors.isEmpty()) {
        //     const error = new Error("Adaugare proprietate esuata");
        //     error.statusCode = 422;
        //     error.data = errors.array();
        //     throw error;
        // }


        let errors = [];

        if (!req.body.title) {
            const error = new Error("Proprietatea trebuie sa aiba titlu");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.suprafata && !Number.isInteger(req.body.suprafata)) {
            const error = new Error(
                "Proprietatea trebuie sa aiba suprafata si aceasta valoare sa fie numar intreg"
            );
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.tara) {
            const error = new Error("Proprietatea trebuie sa aiba tara");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.oras) {
            const error = new Error("Proprietatea trebuie sa aiba oras");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.strada) {
            const error = new Error("Proprietatea trebuie sa aiba strada");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.judet) {
            const error = new Error("Proprietatea trebuie sa aiba judet");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.categoryId) {
            const error = new Error("Proprietatea trebuie sa aiba categorie");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.files["image"]) {
            const error = new Error("Proprietatea trebuie sa aiba macar o imagine");
            error.statusCode = 422;
            errors.push(error.message);
        }

        //console.log(errors);

        if (errors.length !== 0) {
            const error = new Error("Adaugare proprietate esuata");
            error.statusCode = 401;
            error.data = errors;

            throw error;
        }

        req.files["image"].map((file) => {
            picsArray.push(file.path);
        });

        if (req.files["docs"]) {
            req.files["docs"].map((file) => {
                console.log(file);
                docsNameArray.push(file.originalname);
                docsArray.push(file.path);
            });
        }

        let place = new Place({
            title: req.body.title,
            suprafata: req.body.suprafata,
            tara: req.body.tara,
            oras: req.body.oras,
            judet: req.body.judet,
            strada: req.body.strada,
            category: { _id: req.body.categoryId, title: category.title },
            owner: req.userId,
            image: picsArray,
            docs: docsArray,
            docNames: docsNameArray
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
        let owner;
        let category;

        let placesToSend = await Promise.all(
            places.map(async (place) => {
                owner = await User.findById(place.owner);



                return {
                    _id: place._id,
                    title: place.title,
                    suprafata: place.suprafata,
                    tara: place.tara,
                    oras: place.oras,
                    judet: place.judet,
                    strada: place.strada,
                    category: place.category,
                    owner: owner.name
                };
            })
        );
        res.status(200).send({ places: placesToSend });
    } catch (error) {
        next(error)
    }
};


exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;

    try {
        const place = await Place.findById(placeId);


        if (!place) {
            const error = new Error("There is no place for this id");
            error.statusCode = 401;
            throw error;
        }

        const owner = await User.findById(place.owner);
        const category = await Category.findById(place.category);

        const placeToSend = {
            _id: place._id,
            title: place.title,
            suprafata: place.suprafata,
            tara: place.tara,
            oras: place.oras,
            judet: place.judet,
            strada: place.strada,
            category: category,
            owner: { name: owner.name, id: owner._id },
            image: place.image,
        };

        res.status(200).send({ place: placeToSend });
    } catch (error) {
        next(error);
    }
};


exports.editPlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    const errors = validationResult(req);

    let picsArray = [];
    let docsArray = [];
    let docsNameArray = [];

    try {
        const place = await Place.findById(placeId);
        const oldPlace = place;

        let errors = [];

        if (!req.body.title) {
            const error = new Error("Proprietatea trebuie sa aiba titlu");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.suprafata && !Number.isInteger(req.body.suprafata)) {
            const error = new Error(
                "Proprietatea trebuie sa aiba suprafata si aceasta valoare sa fie numar intreg"
            );
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.tara) {
            const error = new Error("Proprietatea trebuie sa aiba tara");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.oras) {
            const error = new Error("Proprietatea trebuie sa aiba oras");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.strada) {
            const error = new Error("Proprietatea trebuie sa aiba strada");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.judet) {
            const error = new Error("Proprietatea trebuie sa aiba judet");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.body.categoryId) {
            const error = new Error("Proprietatea trebuie sa aiba categorie");
            error.statusCode = 422;
            errors.push(error.message);
        }

        if (!req.files["image"]) {
            const error = new Error("Proprietatea trebuie sa aiba macar o imagine");
            error.statusCode = 422;
            errors.push(error.message);
        }

        //console.log(errors);

        if (errors.length !== 0) {
            const error = new Error("Adaugare proprietate esuata");
            error.statusCode = 401;
            error.data = errors;

            throw error;
        }

        req.files["image"].map((file) => {
            picsArray.push(file.path);
        });

        if (req.files["docs"]) {
            req.files["docs"].map((file) => {
                console.log(file);
                docsNameArray.push(file.originalname);
                docsArray.push(file.path);
            });
        }

        const category = await Category.findById(req.body.categoryId);
        place.category = { _id: category._id, title: category.title }

        place.title = req.body.title || oldPlace.title;
        place.suprafata = req.body.suprafata || oldPlace.suprafata;
        place.tara = req.body.tara || oldPlace.tara;
        place.oras = req.body.oras || oldPlace.oras;
        place.judet = req.body.judet || oldPlace.judet;
        place.strada = req.body.starda || oldPlace.strada;
        place.category = req.body.category || oldPlace.category;
        // place.owner = req.body.owner || oldPlace.owner;
        place.image = picsArray || oldPlace.image;

        await place.save();

        res.status(200).send(place);

    } catch (error) {
        next(error);
    }
}

exports.deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    try {
        const place = await Place.findById(placeId);

        if (!place) {
            const error = new Error("Could not find place.");
            error.statusCode = 422;
            throw error;
        }

        if (place.owner._id.toString() !== req.userId) {
            const error = new Error("Not authorized!");
            error.statusCode = 422;
            throw error;
        }

        await Place.deleteOne({ _id: placeId });

        res.status(200).json({ message: "Deleted property!" });
    } catch (error) {
        next(error);
    }
};