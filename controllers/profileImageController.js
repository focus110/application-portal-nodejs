const response = require("../helper/response");
const Profile = require("../models/profileImage");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Config import
const { secret } = require("../config/dbConfig");
const { validationResult } = require("express-validator");

class profileImageController {
  // GET ALL USERS
  static async listImages(req, res) {
    try {
      const imgUrl = await Profile.findAll({
        // attributes: { exclude: ["password"] },
      });

      if (!imgUrl) {
        return res
          .status(404)
          .send(response("Faild to fetch imgUrl", {}, false));
      }

      res.send(response("Fetched users successfully", imgUrl));
    } catch (err) {
      console.log(err.message);
    }
  }

  // FETCH USER BY ID
  static async findImagebyId(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findOne({
        attributes: { exclude: ["password"] },
        where: { id: id },
      });

      if (!user) {
        return res.status(404).send(response("Faild to fetch user", {}, false));
      }

      res.send(response("Fetched user successfully", user));
    } catch (err) {
      console.log(err.message);
    }
  }

  // REGISTER USER
  static async uploadImage(req, res) {
    // validate email
    // const errors = validationResult(req);

    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() });

    try {
      const { imgUrl } = req.body;

      // save User in the database
      const img = await Profile.create({
        profileImg: imgUrl,
      });

      if (!img)
        return res
          .status(500)
          .send(response("The user can not be created", {}, false));

      res.send(response("Image uploaded successfully", img));
    } catch (err) {
      console.log(err.message);
    }
  }

  // UPDATE USER BY ID
  static async updateImageById(req, res) {
    try {
      let { profileImage, username, email, phone, password } = req.body;
      const id = req.params.id;

      // find the id in database
      const userExists = await User.findOne({
        where: {
          id: id,
        },
      });

      // if password is provided then bcrypt password
      password ? (password = bcrypt.hashSync(password, 10)) : null;

      // if id do not exist print error message
      if (!userExists)
        return res
          .status(500)
          .send(response(" User with the given ID does not exists", {}, false));

      // update user username, email, phone, password
      const user = await User.update(
        {
          profileImage: profileImage,
          username: username,
          email: email,
          phone: phone,
          password: password,
        },
        { where: { id: id } }
      );

      if (!user)
        return res
          .status(500)
          .send(response("The user can not be updated", {}, false));

      return res.send(response("User was successfully updated", user));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Here we are not deleting the actual user but we are changing the accountStatus field of the user from active to notActive
  static async deleteImageById(req, res) {
    try {
      const id = req.params.id;

      const userExists = await User.findOne({ where: { id: id } });

      if (!userExists) {
        return res.status(404).send(response("user not found", {}, false));
      }

      const user = await User.update(
        {
          accountStatus: "notActive",
        },
        { where: { id: id } }
      );

      if (!user)
        return res
          .status(500)
          .send(response(" User can not be deleted ", {}, false));

      return res.send(response("User was successfully deleted", user));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = profileImageController;
