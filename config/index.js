require("dotenv").config();

const dev = {
	app: {
		serverPort: process.env.SERVER_PORT || 8080,
	},
	db: {
		url: process.env.MONGODB_URL || "mongodb://127.0.0.1:UserAdmin"
	},
};

module.exports = dev;