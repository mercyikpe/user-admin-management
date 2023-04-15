require("dotenv").config();

const dev = {
	app: {
		serverPort: process.env.SERVER_PORT || 8080,
		jwtSecretKey: process.env.JWT_SECRET_KEY || "poiuytrewq",
	},
	db: {
		url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/UserAdmin"
	},
};

module.exports = dev;