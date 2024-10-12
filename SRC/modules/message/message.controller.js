
import userModel from "../../../DB/models/user.model.js";
import messageModel from "../../../DB/models/Message.model.js";
import jwt from 'jsonwebtoken'

export const sendMessage =async (req,res)=>{
    
    const {message}= req.body;
    const{recivedId}= req.params;

    const user = await userModel.findById(recivedId);
    if(!user){    // بدي اتاكد اذا اليوزر موجود عندي 
        return res.status(404).json({message:"User Not Found"});
    }
    
    await messageModel.create({message,recivedId});//اذا تمام بضيفه عجدول الرسائل

  return res.status(201).json({message:"success"})


}

export const getMessages=async(req,res)=>{
    try{
    const {token}=req.headers;
    const decoded = jwt.verify(token,process.env.Signiture)
    if(!decoded){
        return res.status(404).json({message:"invalid token"})
    }
    const id=decoded.id;
    const messages = await messageModel.find({recivedId:req.id})
    return res.status(201).json({message:"success",messages})
}catch(error){
    res.status(500).json({error:"catch error",error:error.stack})
}
}