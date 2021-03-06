const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user.modal')
const JWT = require('../utils/token')
const Role = require('../models/roles.modal')
const Token = require('../middleware/token.middleware')
const SendEmail = require('../utils/sendMail')

router.post('/add', Token.checkToken ,async (req, res) => {
    Promise.all([
        User.findOne({ email: req.body.email }),
        Role.findOne({ name: req.body.role }),
    ]).then(([user, role]) => {
        if (user)
            return res.status(409).json({ message: 'User already exists' })
        if (!role)
            return res
                .status(400)
                .json({ message: 'role does not exist in database' })

        if (role.rank <= res.locals.user.role.rank) {
            bcrypt.hash('young', 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err,
                    })
                }else{
                    const _id=new mongoose.Types.ObjectId()
                  const user= new User({
                    _id,
                    email:req.body.email,
                    password:hash,
                    role:role.id
                  })

                  const token=await JWT.sign(req.body.email,_id,role)
                  SendEmail(req.body.email,token)
                  user.save().then(()=>res.status(200).json({
                    success:true,
                    message:'New User Added'
                  }))
                }
            })
        }
        else
        return res.status(401).json({
          success:false,
          message:'operation not permitted. Cannot invite higher rank'
        })
    })
})

router.post('/signin', function(req, res) {
    User.findOne({ email: req.body.email })
        .exec()
        .then(function(user) {
            bcrypt.compare(req.body.password, user.password, function(
                err,
                result
            ) {
                if (result) {
                    Role.findById(user.role).then(role => {
                        const JWTToken = JWT.sign(user.email, user._id, role)
                        return res.status(200).json({
                            success: true,
                            token: JWTToken,
                            expiresIn: 2 * 60 * 60,
                        })
                    })
                } else {
                    return res.status(401).json({
                        failed: 'Unauthorized Access',
                    })
                }
            })
        })
        .catch(() => {
            res.status(402).json({
                error: 'Please signup first',
            })
        })
})

module.exports = router
