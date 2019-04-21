const mongoose = require ('mongoose');

const role = mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  rank: {type: Number, required: true},
});

module.exports = mongoose.model ('Roles', role);
