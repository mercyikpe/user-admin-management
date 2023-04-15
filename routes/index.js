const formidableMiddleware = require("express-formidable");
const router = require("express").Router();
const { registerUser } = require("../controllers/users");

router.post("/register", formidableMiddleware(), registerUser);

module.exports = router;
