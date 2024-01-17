const { mongoose } = require("mongoose");
const { categorySchema } = require('../models/category');//relationam place cu category

const salesSchema = mongoose.Schema({
    client: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "User",
    },
    place: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Place",
    },
    data_start: {
        type: String,
    },
    data_end: {
        type: String,
    }


});

const Sale = mongoose.model("Place", salesSchema);
exports.Sale = Sale;

