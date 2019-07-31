const mongoose = require('mongoose')

const product = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, required: true },
    lastModified:{type:Date,required:true},
    createdBy: { type: String, required: true },
})

module.exports = mongoose.model('Product', product)
