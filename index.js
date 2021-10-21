// const express = require('express');
// const {MongoClient} = require('mongodb');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

// const uri = 'mongodb+srv://demoDatabase:demo12345@cluster0.sa9mf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   const productCollection = client.db("organicdb").collection("product");
//   app.post("/addProduct", (req, res) => {
//      const product = req.body;
//      productCollection.insertOne(product)
//      .then(result => {
//          console.log('addeded');
//          res.send('success')
//      })
//   })
// })

// app.delete("/delete/:id", (req, res) => {
//     console.log(req.params.id);
//     productCollection.deleteOne({_id: req.params.id})
//     .then((err, result) => {
//         console.log(result);
//     })
// })

// app.listen(3000);




//practice
const express = require('express');
const bodyParser = require('body-parser'); //install body-parser
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


//home path setting, res.sendFile(__dirname + "/index.html")
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

const uri = 'mongodb+srv://demoDatabase:demo12345@cluster0.sa9mf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const productCollection = client.db("organicdb").collection("product");

//POST-1: send to database from home page, form action="/addProduct" method="post"
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      res.redirect('/')
    })
  })

  //GET-2: get data from database to show home page
  // fetch all products
  app.get('/products', (req, res) => {
  productCollection.find({})
  .toArray((error, documents) => {
    res.send(documents)
  })
});

  //GET-2: single product
  app.get('/singleProduct/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id) })
    .toArray ((error, documents) => {
      res.send(documents[0])
    })
  })

//DELETE-3: dynamic api delete
app.delete('/delete/:id', (req, res) => {
  console.log(req.params.id);
  productCollection.deleteOne({_id: ObjectId(req.params.id)} )
  .then((result) => {
    res.send(result.deletedCount > 0)
  })
});

//update data
app.patch('/update/:id', (req, res) => {
  console.log(req.body.price);
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set:{"price": req.body.price, "quantity": req.body.quantity}
    }
  )
  .then((result) => {
    console.log(result);
  })
})


});


app.listen(3000);
