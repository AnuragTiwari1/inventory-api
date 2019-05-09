const JWT = require('../utils/token')
module.exports = {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    checkToken: async (req, res, next) => {
        if (req.headers['x-access-token'] || req.headers['authorization']) {
            try {
                const decode = await JWT.verify(
                    req.headers['x-access-token'] ||
                        req.headers['authorization']
                )
                res.locals.user = decode
                next()
            } catch (error) {
                return res.status(402).json(error)
            }
        } else
            return res.status(402).json({
                success: false,
                message: 'token not found',
            })
    },
}
