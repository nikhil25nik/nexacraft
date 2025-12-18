import {handleError} from '../helper/handleError.js'
import User from "../model/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";


export const register = async(req,res,next)=>{
    try{
        const {email,name,password} = req.body;

        const checkUser = await User.findOne({email});

        if(checkUser){
           return next(handleError(409,"User already registered!"));
        }

        const hashedPassword = bcryptjs.hashSync(password,10);

        let newUser = new User({
            name,email,password:hashedPassword
        })

        await newUser.save();

        res.status(200).json({
            success:true,
            message:"User Register Successfully!",
            
        })
    }catch(err){
        next(handleError(500,err.message))
    }
}

export const login = async(req,res,next)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
           return next(handleError(404,"Invalid credentials"));
        }

        const hashedPassword = user.password;
        const comparedPassword = await bcryptjs.compare(password,hashedPassword);

        if(!comparedPassword){
          return  next(handleError(404,"invalid credentials"))
        }

        const token = jwt.sign({
            id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
        },process.env.JWT_SECRET);

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            path:"/"
        })

          const newUser = user.toObject({getters:true});
          delete newUser.password
        res.status(200).json({
            success:true,
            message:"User succesfully login",
            user:newUser
        })

    }catch(err){
        next(handleError(500,err.message))
    }
}

export const googleLogin = async(req,res,next)=>{
    try{
        const {name,email,avatar} = req.body;
        let user;
        user = await User.findOne({email});

        if(!user){
            const password = Math.random().toString();
            const hashedPassword = bcryptjs.hashSync(password);
            const newUser = new User({
                name,email,avatar,password:hashedPassword
            })
            
            user = await newUser.save();

        }

        const token = jwt.sign({
            id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
        },process.env.JWT_SECRET);

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none":"strict",
            path:"/"
        });

        const newUser = user.toObject({getters:true})
        delete newUser.password

        res.status(200).json({
            success:true,
            message:"User login successfully!",
            user:newUser
        })

    }catch(err){
        next(handleError(500,err.message));
    }
}

export const logout = async(req,res,next)=>{
    try{
        res.clearCookie("access_token",{
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "strict" :"none",
            path:"/"
        })

        res.status(200).json({
            success:true,
            message:"user logout successfully!"
        })

    }catch(err){
        next(handleError(500,err.message))
    }
}