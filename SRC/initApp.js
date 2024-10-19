import { AppError } from '../appError.js';
import connectDb from './../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import messageRouter from './modules/message/message.router.js'
import postRouter from './modules/post/post.router.js'


const initApp=(app,express)=>{
    connectDb();
    app.use(express.json());
    app.use('/auth',authRouter);
    app.use('/message',messageRouter)
    app.use('/post',postRouter)
    app.use('*',(req,res,next)=>{
        return next(new AppError("page not found",400))
    });

    // global error handling >> اي مكان ممكن يحصل فيه خطا بيف الفنكشن وبمرر الخطا كنص في مسج
    app.use( (err,req,res,next) =>{
        return res.status(err.statusCode).json({message:err.message})
    });
    /*
    app.use( (suc,req,res,next) =>{
        return res.status(suc.statusCode).json({message:suc.message})
    });
    */
}

export default initApp;