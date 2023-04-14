const express = require("express");
const app = express();

const dev = require("./config");

const PORT = dev.app.serverPort;


// test route
app.get('/', (req, res) => {
	res.json({ message: "Server is running just fine"})
})

app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
});