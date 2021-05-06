const path = require('path');

const mongodb = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);


mongodb.connect('mongodb+srv://David:u1d0ToycqwH1YlXj@cluster0.9gsy2.mongodb.net/shop?retryWrites=true&w=majority',
                { useNewUrlParser: true, useUnifiedTopology: true })
.then( client => {
  console.log('We are connected!');
  client.close()
})
.catch( err  => {
  console.log(err);
})

app.listen(3100);
