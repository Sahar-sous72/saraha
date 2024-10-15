// لحتى نهندل الايرور ويكون اسهل في التعديل من catch error 

export const asyncHandler =(func)=>{
 return async(req,res,next)=>{
    try{

     return await func(req,res,next);
    }catch(error){
        return res.status(500).json({message:"catch error", error:error.stack})
    }
 }
}