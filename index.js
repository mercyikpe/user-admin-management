const express = require("express");
const morgan = require("morgan");

const dev = require("./config");
const connectDB = require("./config/db");
const userRouter = require("./routes/users");

const app = express();

const PORT = dev.app.serverPort;

app.use(morgan("dev"));
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
app.use("/api/users", userRouter);

// test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running just fine" });
});

app.listen(PORT, async () => {
  console.log(`se(rver is running at http://localhost:${PORT}`);
  await connectDB();
});
