const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// mongodb
console.log("user",process.env.DB_USER)
console.log("pass",process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uok4zlq.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const AllFoodItems = client.db("eatLink").collection("AllFoodItems");
    const OrderedItems = client.db("eatLink").collection("OrderedItems");
    const UserCollection = client.db("eatLink").collection("user");

    
    app.post("/allfooditems",async(req,res)=>{
      const item=req.body;
      // console.log(item)
        const result=await AllFoodItems.insertOne(item)
        // console.log(result)
        res.send(result)
      })
    app.get("/allfooditems",async(req,res)=>{
    const result=await AllFoodItems.find().toArray();
    res.send(result)
    })
    // user added food
    app.get("/userAddedFood",async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result=await AllFoodItems.find(query).toArray();
        res.send(result)
    })
// update food

    app.get("/updateItem/:id",async(req,res)=>{
      const id=req.params.id;
      console.log(id)
      const query={_id:new ObjectId(id)}
      const result=await AllFoodItems.findOne(query);
      console.log("update",result)
      res.send(result)
  })

  app.put("/updateItem/:id", async (req, res) => {
    const id = req.params.id;
    const filter = {
        _id: new ObjectId(id)
    }
    const options = {
        upsert: true
    }
    const item = req.body;
    const updatedItem = {
        $set: {
          img:item.img,
          food_name:item.food_name,
          category:item.category,
          quantity:item.quantity,
          order:item.order,
          price:item.price,
          description:item.description,
          made_by:item.made_by,
          food_origin:item.food_origin,
          email:item.email
        }
    }
    const result = await AllFoodItems.updateOne(filter, updatedItem, options);
    res.send(result)
})


    app.get("/allfooditems/:id",async(req,res)=>{
        const id=req.params.id;
        // console.log(id)
        const query={_id:new ObjectId(id)}
        const result=await AllFoodItems.findOne(query);
        // console.log(result)
        res.send(result)
    })

    app.get("/purchase/:id",async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const query={_id:new ObjectId(id)}
        const result=await AllFoodItems.findOne(query);
        console.log("purchase",result)
        res.send(result)
    })

// quantity reduce and order increase

app.patch("/updateQuantity/:id", async (req, res) => {
  const id = req.params.id;
  const filter = {
    _id: new ObjectId(id)
  }
  const item = req.body;
  console.log("patch",typeof(item.quantity))
  const updatedQuantity = {
    $set: {
      quantity: item.quantity,
      order:item.order
    },
  }
  
  console.log(updatedQuantity)
  const result = await AllFoodItems.updateOne(filter, updatedQuantity);
  console.log("result from update quantity",result)
  res.send(result)
})


// top product
app.get("/topProduct", async (req, res) => {
  const result = await AllFoodItems.find().sort({ order: -1 }).toArray();
  res.send(result);
});


// ordered item

app.post("/orderedItem",async(req,res)=>{
  const item=req.body;
  // console.log(item)
    const result=await OrderedItems.insertOne(item)
    // console.log(result)
    res.send(result)
})

app.get("/orderedItem",async(req,res)=>{
  console.log(req.query.email);
  let query = {};
  if (req.query?.email) {
      query = { email: req.query.email }
  }
  const result=await OrderedItems.find(query).toArray();
    res.send(result)
})

app.get("/orderedOneItem/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await OrderedItems.findOne(query)
  res.send(result)
})

// delete
app.delete("/orderedOneItem/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await OrderedItems.deleteOne(query)
  res.send(result)
})

// pagination
    app.get('/itemsCount', async (req, res) => {
        const count = await AllFoodItems.estimatedDocumentCount();
        res.send({ count });
      })

      app.get('/items', async (req, res) => {
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
  
        console.log('pagination query', page, size);
        const result = await AllFoodItems.find()
        .skip(page * size)
        .limit(size)
        .toArray();
        console.log(result)
        res.send(result);
      })
// user info
app.post("/user",async(req,res)=>{
    const user=req.body;
    const result=await UserCollection.insertOne(user)
    res.send(result)
})

app.get("/user",async(req,res)=>{
    const result=await UserCollection.find().toArray();
    res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",async(req,res)=>{
    res.send("Eat Link server in running")
})

app.listen(port,()=>{
    console.log(`eat link is running on ${port}`)
})