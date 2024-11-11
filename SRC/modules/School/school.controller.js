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
      // return res.json(req.files.schoolInfo)
      if(req.files.schoolInfo){
       // return res.json(req.files.schoolInfo)
       const {secure_url,public_id} =await cloudinary.uploader.upload_stream(req.files.schoolInfo.path,{folder:`${process.env.APPNAME}/schoolInfo`});
      req.body.schoolInfo={secure_url,public_id}
      return res.json(req.files.schoolInfo)
      }
     
      return next(new AppSucc("success",200))
  
  

}