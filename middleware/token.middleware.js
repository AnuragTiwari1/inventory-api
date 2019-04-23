const JWT = require ('../utils/token');
module.exports = {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  checkToken: async (req, res, done) => {
    if (req.headers['x-access-token'] || req.headers['authorization']) {
      try {
        await JWT.verify (
          req.headers['x-access-token'] || req.headers['authorization']
        );
        done ();
      } catch (error) {
        return res.status (402).json (error);
      }
    } else
      return res.status (402).json ({
        success: false,
        message: 'token not found',
      });
  },
};
