import User from '../models/User.js'
import emailExists from '../libraries/emailExists.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const generateAccessToken = (payload) => {
    return jsonwebtoken.sign(payload,
                env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME });
}

const generateRefreshToken = (payload) => { 
    return jsonwebtoken.sign(payload,
                    env.JWT_REFRESH_TOKEN_SECRET,
                { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME });
}



class AuthController {
    async register(req, res) {
        try {

            if (!req.body.fullname) {
                throw { code: 400, message: 'Fullname is required !' }
             }
            if (!req.body.email) {
                throw { code: 400, message: 'Email is required !' }
             }
            if (!req.body.password) {
                throw { code: 400, message: 'Password is required !' }
            }
            if (req.body.password.length < 6) {
                throw { code: 400, message: 'Password minimum is 6 characters !' }
            }
            
            let userExists = await emailExists(req.body.email);

            if (userExists) { 
                  res.status(409).json({
                    status: 'Error',
                    message: 'Email already exists'
                 });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            
            const user = await User.create({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword
            });

            if (!user) {
                throw {
                    code: 500,
                    message: 'User register failed !'
                }
            }

            const payload = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
            }

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.status(201).json({
                    status: true,
                    message: 'User registered successfully',
                    user,
                    accessToken,
                    refreshToken
                })
        } catch (error) {
            res.status(error.code || 500).json(
                {
                    status: false,
                    message: error.message
                })
        }
    }
    

    async login(req, res) {
        try {
            if(!req.body.email) {
                throw { code: 400, message: 'Email is required !' }
            }

            if (!req.body.password) {
                throw { code: 400, message: 'Password is required !' }
            }

            const user = await User.findOne({ email: req.body.email });
            
            if (!user) { 
                throw { code: 404, message: 'Invalid Email or Password' }
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                throw { code: 404, message: 'Invalid Email or Password' }
            }

            const payload = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
            }

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.status(200).json({
                status: true,
                message: 'User logged in successfully',
                user: {
                    fullname: user.fullname,
                    email: user.email,
                },
                accessToken,
                refreshToken
            })


        } catch (error) {
            res.status(error.code || 500).json(
                {
                    status: false,
                    message: error.message
                })
            
        }

    }

    async refreshToken(req, res) {
        try {

            if (!req.body.refreshToken) { throw { code: 400, message: 'Refresh token is required !' } }
    
            //verify refresh token
            const verify = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET);
    
            let payload = {
                id: verify.id,
                fullname: verify.fullname,
                email: verify.email,
            }

            const accessToken = await generateAccessToken(payload);
            const refreshToken = await generateRefreshToken(payload);

        res.status(200)
                .json({
                    status: true,
                    message: 'Token refreshed successfully',
                    accessToken,
                    refreshToken
                })

        } catch (error) {

            const errorJwt = ['invalid signature', 'invalid token', 'jwt malformed', 'jwt must be provided'];

            if (error.message == 'jwt expired') { 
                error.message = 'Refresh token expired !'
            } else if (errorJwt.includes(error.message)) {
                error.message = 'Invalid refresh token !'
            }

            res.status(error.code || 500).json(
                {
                    status: false,
                    message: error.message
                })
        }
    }
}

export default new AuthController();