const express=require("express");
const { MongoClient ,ObjectId} = require('mongodb');
const cors=require("cors");
require('dotenv').config();




const app=express();
const port=5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nw8x5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());

// app.get("/",(req,res)=>{
// console.log("Hello Its Running");
// });

client.connect(err => {
  const productCollection = client.db("tourism").collection("products");
  const orderCollection = client.db("tourism_2").collection("orders");

  app.post('/addProducts',(req,res)=>{
    productCollection.insertOne(req.body)
    .then(result=>res.send(result));
  });

  app.get('/products',async(req,res)=>{
  const result=await productCollection.find({}).toArray();
  res.send(result);
  
  });


  //add order
  app.post("/addorder",(req,res)=>{
// console.log(req.body);
orderCollection.insertOne(req.body)
.then(result=>res.send(result));
  });

  //myorders

  app.get("/myorders/:email",async(req,res)=>{
    // console.log(req.params.email);
    const result=await orderCollection.find({email:req.params.email}).toArray();
    //  res.send(result);
    res.send(result);
    
    });

    app.delete("/deleteorder/:id",async(req,res)=>{
      console.log(req.params.id);
      const result= await orderCollection.deleteOne({
        _id:(req.params.id),
      });
      console.log(result);

    })


   

});


app.listen(port,()=>{
console.log("Running server on port",port);
});