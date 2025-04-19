const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5050;

// ✅ Use container name `mongo` and authSource=admin
const MONGO_URL = "mongodb://admin:querty@mongo:27017/?authSource=admin";
const client = new MongoClient(MONGO_URL);

let db;

async function initMongo() {
  try {
    await client.connect();
    db = client.db("ankit-chauhan-demo1-db");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/getUsers", async (req, res) => {
  try {
    const data = await db.collection("users").find({}).toArray();
    res.send(data);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

app.post("/addUser", async (req, res) => {
  try {
    const result = await db.collection("users").insertOne(req.body);
    res.send({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("Error adding user");
  }
});

app.listen(PORT, async () => {
  await initMongo();
  console.log(`Server running on port ${PORT}`);
});
