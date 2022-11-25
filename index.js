const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("used cars buy sell server in running.");
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});
