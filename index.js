require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.hcojg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const reviewsCollection = client.db("gamerDB").collection("reviews");
    const watchListCollection = client.db("gamerDB").collection("watchList");
    // const haiku = database;

    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      //   console.log(newReview);
      const result = await reviewsCollection.insertOne(newReview);
      res.send(result);

    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });
    

    app.post("/addToWatchList", async (req, res) => {
      const newWatchListCollection = req.body;
      //   console.log(newReview);
      const result = await watchListCollection.insertOne(newWatchListCollection);
      res.send(result);

      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });


    // get my reviews data by logged in user email
    
    app.get("/MyReviews/:email", async(req, res) => {
      const email = req.params.email;
      const query = {userEmail: email}
      const cursor = reviewsCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    });
    
    
    
    // get my gameWatchList data by logged in user email
    
    app.get("/gameWatchList/:email", async(req, res) => {
      const email = req.params.email;
      const query = {loggedInUserEmail: email}
      const cursor = watchListCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    });
    

    // delete review by id

    app.delete("/delete/:id", async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await reviewsCollection.deleteOne(query);
      res.send(result)
    })


    // update review by id

    app.put("/updateReview/:id", async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updatedInfo = req.body
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          gameCover: updatedInfo.gameCover,
          gameTitle: updatedInfo.gameTitle,
          reviewDescription: updatedInfo.reviewDescription,
          rating: updatedInfo.rating,
          publishingYear: updatedInfo.publishingYear,
          genres: updatedInfo.genres,
          userName: updatedInfo.userName,
          userEmail: updatedInfo.userEmail,
        },
      };
      const result = await reviewsCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
    
    app.get("/reviews", async(req, res) => {
      const cursor = reviewsCollection.find().limit(6)
      const result = await cursor.toArray();
      res.send(result)
    });
    
    app.get("/allReviews", async(req, res) => {
      const cursor = reviewsCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    });
    
    app.get("/allReviews/:id", async(req, res) => {
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await reviewsCollection.findOne(query)
        res.send(result)
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`our server is running on port ${port}`);
});
