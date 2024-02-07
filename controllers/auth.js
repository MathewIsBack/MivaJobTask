import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const signup = async(req, res, next) => {
    try{
        const { username, email } = req.body;

        const usernameCheck = await User.findOne({ username });

        if(usernameCheck){
            next(errorHandler(404, 'Username already exists'));
        }

        const emailCheck = await User.findOne({ email })

        if(emailCheck) {
            return res.status(404).json({msg:'Email already exists', status: false})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        await user.save();

        const {password, ...rest} = user.toObject();

        return res.status(201).json({status: true, user: rest})

    }catch(error){
        next(error)
    }
}

export const login = async (req, res, next) => {
    try{
        const { identifier } = req.body;

        const user = await User.findOne({
            $or: [{ username: identifier }, {email: identifier}]
        });

        if(!user){
            next(errorHandler(404, 'Username or email wrong'))
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)

        if(!isPasswordCorrect){
            next(errorHandler(404, 'Password is incorrect'));
        }

        const {password, ...rest} = user.toObject();

        const token = jwt.sign({
            id: user._id,
            user: user
        }, process.env.JWT_SECRET_KEY, {expiresIn:'3d'})

        return res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json({status: true, user: rest})


    }catch(error){
        console.log(error)
    }
}