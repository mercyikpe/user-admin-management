const bcrypt = require("bcrypt")
const saltRounds = 10;

const securepassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = securepassword;