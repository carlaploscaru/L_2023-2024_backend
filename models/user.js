const { mongoose } = require("mongoose");

const userSchema = mongoose.Schema({//obj relational mapping
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registryToken: {
        type: String,
        required: false,//alt+shift+f
    },
    registryTokenExpiration: {
        type: String,
        required: false
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiration: {
        type: String,
        required: false
    },//for password recovery
    isAdmin: {
        type: Boolean,
        required: false,
    },
    isOwner: {
        type: Boolean,
        required: false
    }
});

const User=mongoose.model("User", userSchema);
exports.User=User;//daca nu fac export nu pot sa fac import in alt loc