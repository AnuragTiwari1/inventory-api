const jwt = require ('jsonwebtoken');

module.exports = {
  verify: token => {
    return new Promise ((res, rej) => {
      if (token) {
        // verifies secret and checks exp
        jwt.verify (
          token,
          new Buffer (process.env.JWTsecret, 'base64'),
          function (err, decoded) {
            if (err) {
              rej ({
                success: false,
                message: 'Failed to authenticate token.',
              });
            } else {
              // if everything is good, save to request for use in other routes
              res (decoded);
            }
          }
        );
      }
    });
  },
  sign: (email, _id,role) => {
    return jwt.sign (
      {email, _id,role},
      new Buffer (process.env.JWTsecret, 'base64'),
      {
        expiresIn: '2h',
      }
    );
  },
};
