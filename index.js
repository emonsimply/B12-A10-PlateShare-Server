const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.td2q5ge.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const db = client.db("food-db");
    const foodCollection = db.collection("foods");

    app.get("/foods", async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    });

    app.get("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);

      const result = await foodCollection.findOne({ _id: objectId });

      res.send({
        success: true,
        result,
      });
    });

    app.get("/featured-foods", async (req, res) => {
      const result = await foodCollection
        .find()
        .sort({ quantity: "desc" })
        .limit(6)
        .toArray();

      console.log(result);

      res.send(result);
    });


    app.post("/foods", async (req, res) => {
      const data = req.body;
      const result = await foodCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
