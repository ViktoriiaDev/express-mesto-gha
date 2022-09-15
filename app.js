const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
  autoCreate: true
}, (error) => {
  if(!error) {
    console.log('mongoose connected');
  }
});

app.use((req, res, next) => {
  req.user = {
    _id: '632235d6577653083f3a09c7'
  };

  next();
});

app.use(bodyParser.json());
app.use('/users', userRoute)
app.use('/cards', cardRoute)

app.listen(3000);