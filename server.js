const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
const user = require ('./routes/user.route');
const mongoose = require ('mongoose');
const reset = require ('./routes/reset.routes');

mongoose.connect (process.env.MONGODB_URI);

app.use (bodyParser.urlencoded ({extended: false}));
app.use (bodyParser.json ());

app.get ('/checking', function (req, res) {
  res.json ({
    Tutorial: 'Welcome to the Node express JWT Tutorial',
  });
});

app.use ('/user', user);
app.use ('/reset', reset);

app.listen (process.env.PORT);
