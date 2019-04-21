const mongoose = require ('mongoose');

const user = mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model ('User', user);
