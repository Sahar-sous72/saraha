import { AppError } from "../../../appError.js";
import schoolAdminModel from "../../../DB/models/SchoolAdmin/schoolAdmin.js";
import schoolModel from "../../../DB/models/schools/school.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppSucc } from "../../../AppSucc.js";


export const creteSchool = async(req,res,next)=>{
    const adminId=req.params.id;
    //return res.json(req.params.id)
    req.body.schoolAdminId=adminId;
    const admin =await schoolAdminModel.findById(adminId)
    if(!admin){
        return next(new AppError("user not found",404))
    }
    req.body.schoolName=req.body.schoolName.toLowerCase();
    const name =req.body.schoolName;
    if(await schoolModel.findOne({name})){
        return next(new AppError("school exit",404))
      }
      if (req.file){
       const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APPNAME}/schoolInfo`})
     // return res.json(public_id)
    }
    
      return next(new AppSucc("success",200))
  
  

}