var jwt = require("jsonwebtoken");

const dev = require("../config");
const User = require("../models/users");
const securepassword = require("../helpers/bcryptPassword");
const { sendEmailWithNodeMailer } = require("../helpers/email");

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.fields;
    const { image } = req.files;

    // check that fields are not empty
    if (!name || !email || !phone || !password) {
      return res.status(404).json({
        message: "name, email phone or password is missing",
      });
    }

    // check password length
    if (password.length < 6) {
      return res.status(404).json({
        message: "Minimum length for password is 6 characters",
      });
    }

    // if image is added, check image size
    if (image && image.size > 1000000) {
      return res.status(400).json({
        message: "maximum size of image is 1MB",
      });
    }

    // check if user already exist by id
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.status(400).json({
        message: "User with this email already exist",
      });
    }

    const hashedPassword = await securepassword(password);

    // createToken to store the data
    const token = jwt.sign(
      { email, name, phone, hashedPassword, image },
      dev.app.jwtSecretKey,
      { expiresIn: "10m" }
    );

    // prepare the email: what we want to show in the email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to <a href="${dev.app.clientUrl}/api/users/activate${token}" target="_blank">activate your account</a> </p>
      `, // html body
    };

    sendEmailWithNodeMailer(emailData);
    // send verification email to the user

    res.status(201).json({
      message: "A verification link has been sent to your email.",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const verifyEmail = (req, res) => {
  try {
    const { token } = req.body;
    console.log(token)
    if (!token) {
      return res.status(404).json({
        message: "token is missing",
      });
    }

    res.status(200).json({
      message: "email is verified",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser, verifyEmail };
