import userModel from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from './../../utils/sendEmail.js'
import { LoginSchema, registerSchema } from "./auth.validation.js";
import { AppError } from "../../../appError.js";
import { AppSucc } from "../../../AppSucc.js";

export const register=async(req,res,next)=>{
    
        const{userName,email,password,gender,cpassword}=req.body;

        // validation
       // const result =await registerSchema.body.validate({email,password,userName,gender,cpassword},{abortEarly:false})
        //return res.json(result)
       // or
       //  const result =await registerSchema.validate({req.body},{abortEarly:false})

        // if(result.error?.details){
        //     return res.status(404).json({message:"error validation",error:result.error.details})
        //    }
           


        const user =await userModel.findOne({email}); //to confirm its new person
        if (user){
            return next(new AppError("email exit",409))
        }
        const hashPass= bcrypt.hashSync(password,parseInt(process.env.SALTROUND));

        const html = `
        <div>
         <p style='color:tomato'>Dear : <b>${userName}</b></p>
         <h1 style='text-align:center;color:blue;width:40%'> Welcome in SARAHA SITE !</h1>
         <h2 style='text-align:center;color:blue;width:40%'>Hello <b>${userName}</b> , You are register in our site ,How can help you?</h2>
        </div>
        `
        sendEmail(email,"WELCOME",html);
        const newUser =await userModel.create({userName,password:hashPass,email});
        return next(new AppSucc("success",201))
       // return res.status(201).json({message:"success"})

    
}

export const login = async(req,res,next)=>{
    const{email,password}=req.body;
   // return res.json(req.body)

   const result =LoginSchema.body.validate({email,password,},{abortEarly:false})
   if(result.error?.details){
    return res.status(404).json({message:"error validation",error:result.error.details})
   }
   
    const user =await userModel.findOne({email});
    if(!user){
        return next(new AppError("email not found",409))
    }
    const match=bcrypt.compareSync(password,user.password);
    if(!match){
        return next(new AppError("invalid password",409))
    }
    const token=await jwt.sign({id:user._id},process.env.Signiture,
        {expiresIn:'2h'})

    return res.status(201).json({message:"sucsess",token})
    }
 
export const getAllUsers=async(req,res)=>{
   
    const users =await userModel.find().select('userName');
    return res.status(201).json({message:"success",users})
   
}
export const UploadImage=async(req,res,next)=>{
   // return res.json(req.file)

    const imgUrl =req.file.destination +"/"+req.file.filename;
    const user=await userModel.findByIdAndUpdate(req.id,{profilePicture:imgUrl})
    return next(new AppSucc("success",200))
}
    


