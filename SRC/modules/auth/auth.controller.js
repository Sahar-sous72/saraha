import userModel from '../../../DB/models/Admin/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../Utils/sendEmail.js";
import { LoginSchema, registerSchema } from "./auth.validation.js";
import { AppError } from "../../../appError.js";
import { AppSucc } from "../../../AppSucc.js";
import cloudinary from "../../utils/cloudinary.js";
import schoolAdminModel from "../../../DB/models/SchoolAdmin/schoolAdmin.js";
import adminModel from "../../../DB/models/Admin/admin.js";


export const register=async(req,res,next)=>{
    
        const{userName,email,password}=req.body;

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
            return next(new AppError("you have account",409))
        }
        const hashPass= bcrypt.hashSync(password,parseInt(process.env.SALTROUND));

      /*  const html = `
        <div>
         <p style='color:tomato'>Dear : <b>${userName}</b></p>
         <h1 style='text-align:center;color:blue;width:40%'> Welcome in SARAHA SITE !</h1>
         <h2 style='text-align:center;color:blue;width:40%'>Hello <b>${userName}</b> , You are register in our site ,How can help you?</h2>
        </div>
        `
        sendEmail(email,"WELCOME",html);*/
        const newUser =await userModel.create({userName,password:hashPass,email});
        return next(new AppSucc("success",201))
       // return res.status(201).json({message:"success"})

    
}

export const login = async(req,res,next)=>{
    const{email,password}=req.body;
   // return res.json(req.body)

   
   
    const user =await adminModel.findOne({email});
    if(!user){
        return next(new AppError("email not found",409))
    }
    const match=bcrypt.compareSync(password,user.password);
    if(!match){
        return next(new AppError("invalid password",409))
    }
    const token=await jwt.sign({id:user._id},process.env.Signiture,
        )

    return res.status(201).json({message:"sucsess",token})
    }
 // ger All (schoolAdmin ,teacher,student)
export const getAllUsers=async(req,res)=>{
   
    const users =await userModel.find();

    return res.status(201).json({message:"success",users})
   
}
//get all schoolsAdmins [active]
export const getAllSchoolsAdmins=async(req,res)=>{
   
    const schoolAdmin =await schoolAdminModel.find({status:"active"});

    return res.status(201).json({message:"success",schoolAdmin})
   
}
//get all schoolsAdmins [suspend,rejected]
export const getSchoolReq=async(req,res)=>{
   
    const schoolsAdmins =await schoolAdminModel.find({status:["suspend","rejected"]}).select('userName email status');

    return res.status(201).json({message:"success",schoolsAdmins})
   
}
//make schollAdmin active user
export const updateStatus=async(req,res,next)=>{
    const user = await schoolAdminModel.findById(req.params.id);
   // return res.json(user)
    if(!user){
        return next(new AppError("user not found",404))
    }
    const activeUser ="active";
    const newSchoolAdmin= await schoolAdminModel.findByIdAndUpdate(req.params.id,{
        status:activeUser,
        role:"schoolSdmin"
    },{
        new:true
    })

    return res.json({message:"success",newSchoolAdmin})


}
//reject school request
export const rejectedReq=async(req,res,next)=>{
    const user = await schoolAdminModel.findById(req.params.id);
   // return res.json(user)
    if(!user){
        return next(new AppError("user not found",404))
    }
    const rejectedUser ="rejected";
    const newSchoolAdmin= await schoolAdminModel.findByIdAndUpdate(req.params.id,{
        status:rejectedUser
    },{
        new:true
    })

    return res.json({message:"success",newSchoolAdmin})


}
export const UploadImage=async(req,res,next)=>{
   // return res.json(req.file)

   // const imgUrl =req.file.destination +"/"+req.file.filename;
   const{secure_url}=await cloudinary.uploader.upload(req.file.path);
   // const user=await userModel.findByIdAndUpdate(req.id,{profilePicture:imgUrl})
   const user=await userModel.findByIdAndUpdate(req.id,{profilePicture:secure_url})
    return next(new AppSucc("success",200))
}
   
//update request



