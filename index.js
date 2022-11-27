const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
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

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const productsCollection = client.db("usedCars").collection("products");
    const usersCollection = client.db("usedCars").collection("users");
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

    app.get("/orders", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const query = { email: email };
      const orders = await ordersCollection.find(query).toArray();
      res.send(orders);
    });

    app.post("/addproducts", async (req, res) => {
      const product = req.body;
      const result = await addProductsCollection.insertOne(product);
      res.send(result);
    });

    app.get("/addproducts", async (req, res) => {
      const category = req.body.category;

      // const decodedEmail = req.decoded.email;

      // if (email !== decodedEmail) {
      //   return res.status(403).send({ message: "forbidden access" });
      // const query = { email: email };
      // }
      const query = { category: category };
      const products = await addProductsCollection.find(category).toArray();
      res.send(products);
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "7d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
      console.log(user);
      res.send({ accessToken: "token" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
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
