const response = require("../helper/response");
const User = require("../models/User");
const UserOTP = require("../models/UserOTP");
// const Profile = require("../models/profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// nodemailer
const nodemailer = require("nodemailer");

// Config import
const { secret } = require("../config/dbConfig");
const { validationResult } = require("express-validator");

class UserController {
  // GET ALL USERS
  static async listUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      if (!users) {
        return res
          .status(404)
          .send(response("Faild to fetch users", {}, false));
      }

      res.send(response("Fetched users successfully", users));
    } catch (err) {
      console.log(err.message);
    }
  }

  // FETCH USER BY ID
  static async findUserbyId(req, res) {
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
  static async createUser(req, res) {
    // validate email
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { firstname, lastname, username, gender, phone, email, password } =
        req.body;

      // check if input is empty
      if (!firstname) {
        res.status(400).send({
          message: "Please Insert Firstname",
        });

        return;
      }

      if (!lastname) {
        res.status(400).send({
          message: "Please Insert Lastname",
        });

        return;
      }

      if (!username) {
        res.status(400).send({
          message: "Please Insert Username",
        });

        return;
      }

      if (!gender) {
        res.status(400).send({
          message: "Please Insert gender",
        });

        return;
      }

      if (!email) {
        res.status(400).send({
          message: "Please Insert Email",
        });

        return;
      }

      if (!phone) {
        res.status(400).send({
          message: "Please Insert Phone number",
        });

        return;
      }

      if (!password) {
        res.status(400).send({
          message: "Please Insert password",
        });

        return;
      }

      // Check if email already exists
      const emailExists = await User.findOne({
        where: {
          email: email,
        },
      });

      if (emailExists)
        return res
          .status(500)
          .send(
            response(" User with the given email already exists", {}, false)
          );

      // save User in the database
      const user = await User.create({
        firstname: firstname,
        lastname: lastname,
        username: username,
        gender: gender,
        phone: phone,
        email: email,
        password: bcrypt.hashSync(password, 10),
      });

      if (!user)
        return res
          .status(500)
          .send(response("The user can not be created", {}, false));

      const { id } = user;

      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      const hashedOTP = await bcrypt.hash(otp, 10);

      // save users OTP
      const userOTPS = await UserOTP.create({
        foreign_key: id,
        otp: hashedOTP,
      });

      // // create reusable transporter object using the default SMTP transport
      // let transporter = nodemailer.createTransport({
      //   host: "tekki.com.ng",

      //   auth: {
      //     user: "noreply@gmail.com",
      //     pass: "tyxjef-pefde4-mIngeg",
      //   },
      // });

      // let mailOptions = {
      //   from: `"Fred Foo 👻" th894hru9b49br@gmail.com`, // sender address
      //   to: `${email},`, // list of receivers
      //   subject: "Hello ✔", // Subject line
      //   text: `Otp ${otp}`, // plain text body
      //   html: `<b>${otp}</b>`, // html body
      // };

      // // send mail with defined transport object
      // transporter.sendMail(mailOptions, function (e, info) {
      //   if (e) console.log(e);
      //   if (!e) console.log("Message sent: %s", info.messageId);
      // });

      res.send(response("User was created successfully", { user, userOTPS }));
    } catch (err) {
      console.log(err.message);
    }
  }

  // UPDATE USER BY ID
  static async updateUserById(req, res) {
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

  // LOGIN USER
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email: email } });

      // check if user exit
      if (!user) {
        return res.status(404).send(response("user not found", {}, false));
      }

      let isMatch = bcrypt.compareSync(password, user.password);

      // check if password match
      if (user && isMatch) {
        const token = jwt.sign(
          {
            id: user.id,
            role: user.role,
          },
          secret,
          { expiresIn: "1d" }
        );

        return res.send(
          response("Login successful", {
            user: user.email,
            token: token,
          })
        );
      } else {
        res.status(403).send(response("invalid credentials", {}, false));
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // Here we are not deleting the actual user but we are changing the accountStatus field of the user from active to notActive
  static async deleteUserById(req, res) {
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

module.exports = UserController;
