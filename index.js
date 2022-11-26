const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const ordersCollection = client.db("usedCars").collection("orders");
    const addProductsCollection = client
      .db("usedCars")
      .collection("addProducts");

    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await productsCollection
        .find(query)
        .project({ category: 1, picture: 1, adds: 1 })
        .toArray();
      res.send(result);
    });
    app.get("/category", async (req, res) => {
      const query = {};
      const result = await productsCollection
        .find(query)
        .project({ category: 1 })
        .toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
    });

    app.post("/addproducts", async (req, res) => {
      const product = req.body;
      const result = await addProductsCollection.insertOne(product);
      res.send(result);
    });

    app.get("/addproducts", async (req, res) => {
      const query = {};
      const result = await addProductsCollection.find(query).toArray();
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
