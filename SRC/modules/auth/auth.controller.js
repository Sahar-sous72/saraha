import userModel from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'

export const register=async(req,res)=>{
    try{
        const{userName,email,password}=req.body;
        const user =await userModel.findOne({email}); //to confirm its new person
        if (user){
            return res.status(409).json({message:"Email exist"})
        }
        const hashPass= bcrypt.hashSync(password,parseInt(process.env.SALTROUND))
        const newUser =await userModel.create({userName,password:hashPass,email});
        return res.status(201).json({message:"success",newUser})

    }catch(err){
        return res.status(500).json({error:err.stack})

    }
}