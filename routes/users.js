const formidableMiddleware = require("express-formidable");
const router = require("express").Router();

const { registerUser, verifyEmail, loginUser, logoutUser } = require("../controllers/users");

router.post("/register", formidableMiddleware(), registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
