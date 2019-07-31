const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user.modal')
const Product = require('../models/product.modal')
const JWT = require('../utils/token')
const Role = require('../models/roles.modal')
const Token = require('../middleware/token.middleware')

router.post('/add', Token.checkToken, (req, res) => {
    Promise.all([
        User.findOne({ email: req.body.email }),
        Role.findOne({ name: req.body.role }),
    ]).then(([user, role]) => {
        //check if user exists
        if (user && role.name === 'super admin') {
            const { _id, productName, companyName, quantity } = req.body

            Product.findByIdAndUpdate(
                _id,
                { productName, companyName, quantity },
                { upsert: true },
                err => {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            message: err,
                        })
                    return res.status(200).json({
                        success: true,
                        message: 'Saved Successfully',
                    })
                }
            )
            // if (_id) {
            //     var product=Product.findById(_id)

            // } else {
            //     //create new
            //     var product = new Product({
            //         companyName,
            //         productName,
            //         quantity,
            //         date: new Date(),
            //         createdBy: user,
            //     })
            //     product.save().then(() =>
            //         res.status(200).json({
            //             success: true,
            //             message: 'New Product Added',
            //         })
            //     )
            // }
        } else
            return res.status(401).json({
                success: false,
                message: 'only super admin can add new products',
            })
    })
})
