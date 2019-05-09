const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
const user = require ('./routes/user.route');
const mongoose = require ('mongoose');
const reset = require ('./routes/reset.routes');
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var transporter = nodemailer.createTransport({
    host: 'mail.google.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'anuragweb145@',
        pass: '123456'
    }
});
mongoose.connect (process.env.MONGODB_URI);
const port = process.env.PORT || 3000;
app.use (bodyParser.urlencoded ({extended: false}));
app.use (bodyParser.json ());

app.get ('/checking', function (req, res) {
  res.json ({
    Tutorial: 'Welcome to the Node express JWT Tutorial',
  });
});
app.set('view engine', ejs);
app.use(express.static('public'));
app.use ('/user', user);
app.use ('/reset', reset);

app.listen (port, () => {});
