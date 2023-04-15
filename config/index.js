require("dotenv").config();

const dev = {
	app: {
		serverPort: process.env.SERVER_PORT || 8081,
		jwtSecretKey: process.env.JWT_SECRET_KEY || "poiuytrewq",
		smtpUsername: process.env.SMTP_USERNAME,
		smtpPassword: process.env.SMTP_PASSWORD,
		clientUrl: process.env.CLIENT_URL
	},
	db: {
		url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/user-admin-db"
	}, 
};
 
module.exports = dev;