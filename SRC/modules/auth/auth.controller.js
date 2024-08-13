import userModel from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
export const login=async(req,res)=>{
    const{email,password}=req.body;
   // return res.json(req.body)
    const user =await userModel.findOne({email});
    if(!user){
        return res.status(401).json({error:"user not found"})
    }
    const match=bcrypt.compareSync(password,user.password);
    if(!match){
        return res.status(401).json({error:"invalid password"})
    }
    const token=await jwt.sign({id:user._id},process.env.Signiture,
        {expiresIn:'1h'})

    return res.status(201).json({message:"sucsess",token})
    }
    
    


