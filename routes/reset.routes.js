const express = require ('express');
const router = express.Router ();
const mongoose = require ('mongoose');
const roles = require ('../initialData/roles.json');
const users = require ('../initialData/user.json');
const RoleModel = require ('../models/roles.modal');
const UserModal = require ('../models/user.modal');
const bcrypt = require ('bcryptjs');
const tokenMiddleware = require ('../middleware/token.middleware');
// eslint-disable-next-line node/no-unsupported-features/es-syntax
router.get ('/roles', tokenMiddleware.checkToken, async (req, res) => {
  let success = false;
  let resMessage;
  RoleModel.deleteMany ({}).exec ();
  roles.every (({name, rank}) => {
    new RoleModel ({name, rank, _id: new mongoose.Types.ObjectId ()})
      .save ()
      .then ()
      .catch (({message}) => {
        success = false;
        resMessage = message;
        return false;
      });
    success = true;
    return true;
  });
  success
    ? res.status (200).json ({
        success: true,
      })
    : res.status (500).json ({
        success,
        message: resMessage,
      });
});

// eslint-disable-next-line node/no-unsupported-features/es-syntax
router.get ('/user', tokenMiddleware.checkToken, async (req, res) => {
  UserModal.deleteMany ({}).exec ();
  users
    .map (({email, password, role}) => {
      RoleModel.findOne ({name: role}).exec ().then (roleObj => {
        bcrypt.hash (password, 10, (err, hash) => {
          if (!err) {
            new UserModal ({
              _id: mongoose.Types.ObjectId (),
              email,
              password: hash,
              role: roleObj._id,
            })
              .save ()
              .then (() => {
                res.status (200).json ({
                  success: true,
                });
              });
          }
        });
      });
    })
    .catch (() => {
      res.status (402).json ({
        success: false,
        message: `No role found`,
      });
      return false;
    });
});
module.exports = router;
