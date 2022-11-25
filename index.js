const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywkglu3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("usedCars").collection("products");

    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await productsCollection
        .find(query)
        .project({ category: 1, picture: 1, adds: 1 })
        .toArray();
      res.send(result);
    });
  } finally {
  }
}
run();

app.get("/", (req, res) => {
  res.send("used cars buy sell server in running.");
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});
