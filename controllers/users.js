const jwt = require("jsonwebtoken");
const fs = require("fs");

const dev = require("../config");
const User = require("../models/users");
const securePassword = require("../helpers/bcryptPassword");
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

    const hashedPassword = await securePassword(password);

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

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({
        message: "token is missing",
      });
    }

    // verify token
    jwt.verify(token, dev.app.jwtSecretKey, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          message: "Token is expired",
        });
      }
      // decoded the data
      const { name, email, hashedPassword, phone, image } = decoded;
      // check if user already exist by id
      const isExist = await User.findOne({ email: email });
      if (isExist) {
        return res.status(400).json({
          message: "User with this email already exist",
        });
      }

      // create the user - without the image
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        is_verified: 1,
      });

      if (image) {
        newUser.image.contentType = image.type;
        newUser.image.data = fs.readFileSync(image.path);
      }
      // save the user
      const user = await newUser.save();
      if (!user) {
        res.status(400).json({
          message: "user was not created",
        });
        res.status(201).json({
          message: "user was created, ready to sign in.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check that fields are not empty
    if (!email || !password) {
      return res.status(404).json({
        message: "email or password is missing",
      });
    }

    // check password length
    if (password.length < 6) {
      return res.status(404).json({
        message: "Minimum length for password is 6 characters",
      });
    }

    // check if user already exist by id
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User with this email does not exist. Please register.",
      });
    }

    // compare password
    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "email/password mismatched",
      });
    }

    // creating a session -> cookie

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser, verifyEmail, loginUser, logoutUser };
