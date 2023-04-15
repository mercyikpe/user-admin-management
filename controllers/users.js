const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.fields;
    const { image } = req.files;

    // check that fields are not empty
    if(!name || !email || !phone || !password) {
        return res.status(404).json({
            message: "name, email phone or password is missing",
        });
    }

    // check password length
    if(password.length < 6) {
        return res.status(404).json({
            message: "Minimum length for password is 6",
        });
    }

    // if image is added, check image size
    if(image && image.size > 1000000) {
        return res.status(400).json({
            message: "maximum size of image is 1MB",
        });
    }

    // check if user already exist by id
     const isExist = User.findOne({email: email})
    if(isExist) {
        res.status(400).json({
            message: "User with this email already exist"
        })
    }

    res.status(201).json({
      message: "user created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser };
