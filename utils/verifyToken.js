import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js'

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err){
            return next(errorHandler(401, 'Unauthorized now'))
        }
        req.user = user;
        next();
    })
}