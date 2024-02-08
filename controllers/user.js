const { User } = require("../models/user");
const { validationResult } = require("express-validator");

exports.getUsers = async (req, res, next) => {
  let users = [];
  let usersToSend = [];

  try {
    users = await User.find();

    usersToSend = users.map((user) => {
      return { _id: user._id, name: user.name, email: user.email };
    });

    res.status(200).send(usersToSend);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  let me = null;
  let meToSend = null;

  try {
    me = await User.findById(req.userId);
    if (!me) {
      const error = new Error("Not existing!");
      error.statusCode = 422;
      throw error;
    }

    meToSend = {
      _id: me._id,
      name: me.name,
      email: me.email,
      image: me.image
    };

    res.status(200).send({ me: meToSend });
  } catch (err) {
    next(err);
  }
};

exports.editUser = async (req, res, next) => {
  

  const userId = req.userId;
  try {
    let errors = [];
    let user = await User.findById(userId);

    if (user) {
      if (req.body.name) {
        user.name = req.body.name;
      }

      if (!req.body.name) {
        const error = new Error(" The user must have name!");
        error.statusCode = 422;
        errors.push(error.message);
      }
      


      if (errors.length !== 0) {
        const error = new Error("User edit failed!");
        error.statusCode = 401;
        error.data = errors;
        throw error;
      }
      
      console.log(req.files["image"]);

      if (req.files && req.files["image"]) {
        user.image = req.files["image"][0].path;
      }
      await user.save();
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};