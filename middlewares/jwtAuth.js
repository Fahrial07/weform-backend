import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

const jwtAuth = () => {
    return async (req, res, next) => { 
        try {
            if(!req.headers.authorization) { throw { code: 401, message: 'Unauthorized !' } }

            const token = req.headers.authorization.split(' ')[1];
            const verify = jsonwebtoken.decode(token, env.JWT_ACCESS_TOKEN_SECRET);
            req.jwt = verify;
            next()
        } catch (error) {
            const errorJwt = ['invalid signature', 'invalid token', 'jwt malformed', 'jwt must be provided'];

            if (error.message == 'jwt expired') { 
                error.message = 'Access token expired !'
            } else if (errorJwt.includes(error.message)) {
                error.message = 'Invalid access token !'
            }

            res.status(error.code || 500).json(
                {
                    status: false,
                    message: error.message
                })
        }
    }
}

export default jwtAuth;
