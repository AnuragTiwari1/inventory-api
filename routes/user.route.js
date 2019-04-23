const express = require ('express');
const router = express.Router ();
const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const User = require ('../models/user.modal');
const JWT = require ('../utils/token');
router.post ('/signup', function (req, res) {
  User.findOne ({email: req.body.email})
    .exec ()
    .then (user => {
      if (user) return res.status (402).json ({message: 'User already exits'});
      else {
        bcrypt.hash (req.body.password, 10, function (err, hash) {
          if (err) {
            return res.status (500).json ({
              success: false,
              error: err,
            });
          } else {
            const user = new User ({
              _id: new mongoose.Types.ObjectId (),
              email: req.body.email,
              password: hash,
            });
            user
              .save ()
              .then (function () {
                res.status (200).json ({
                  success: true,
                  message: 'New User has been created',
                });
              })
              .catch (error => {
                res.status (500).json ({
                  error: error,
                });
              });
          }
        });
      }
    })
    .catch (error =>
      res.status (500).json ({
        success: false,
        error: error,
      })
    );
});

router.post ('/signin', function (req, res) {
  User.findOne ({email: req.body.email})
    .exec ()
    .then (function (user) {
      bcrypt.compare (req.body.password, user.password, function (err, result) {
        if (err) {
          return res.status (401).json ({
            failed: 'Unauthorized Access',
          });
        }
        if (result) {
          const JWTToken = JWT.sign (user.email, user._id);

          return res.status (200).json ({
            success: 'Welcome to the JWT Auth',
            token: JWTToken,
          });
        }
        return res.status (401).json ({
          failed: 'Unauthorized Access',
        });
      });
    })
    .catch (() => {
      res.status (402).json ({
        error: 'Please signup first',
      });
    });
});

module.exports = router;
