const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoute = require('./routes/users')
const app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
  autoCreate: true
}, (error) => {
  if(!error) {
    console.log('mongoose connected');
  }
});

app.use('/users', userRoute)

app.listen(3000);