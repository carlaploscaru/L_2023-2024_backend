const { User } = require("../models/user");

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
      const error = new Error("Nu exist!");
      error.statusCode = 422;
      throw error;
    }

    meToSend = {
      _id: me._id,
      name: me.name,
      email: me.email,
      image: me.image
    };

    res.status(200).send({me: meToSend});
  } catch (err) {
    next(err);
  }
};

exports.editUser = async (req, res, next) => {
    const userId = req.userId;
    try {
      let user = await User.findById(userId);
  
      if (user) {
        if (req.body.name) {
          user.name = req.body.name;
        }
  
        if (req.body.email) {
          user.email = req.body.email;
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