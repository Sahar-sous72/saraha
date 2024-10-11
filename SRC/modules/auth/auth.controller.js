import userModel from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from './../../utils/sendEmail.js'
import { LoginSchema, registerSchema } from "./auth.validation.js";

export const register=async(req,res)=>{
    try{
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
            return res.status(409).json({message:"Email exist"})
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
        return res.status(201).json({message:"success"})

    }catch(err){
        return res.status(500).json({error:err.stack})

    }
}

export const login=async(req,res)=>{
    const{email,password}=req.body;
   // return res.json(req.body)

   const result =LoginSchema.body.validate({email,password,},{abortEarly:false})
   if(result.error?.details){
    return res.status(404).json({message:"error validation",error:result.error.details})
   }
   
    const user =await userModel.findOne({email});
    if(!user){
        return res.status(401).json({error:"email not found"})
    }
    const match=bcrypt.compareSync(password,user.password);
    if(!match){
        return res.status(401).json({error:"invalid password"})
    }
    const token=await jwt.sign({id:user._id},process.env.Signiture,
        {expiresIn:'1h'})

    return res.status(201).json({message:"sucsess",token})
    }
 
export const getAllUsers=async(req,res)=>{
    try{
    const users =await userModel.find().select('userName');
    return res.status(201).json({message:"success",users})
    }catch(error){
        return res.status(500).json({message:"catch error", error:error.stack})
    }
}
    


