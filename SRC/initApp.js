import connectDb from './../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'


const initApp=(app,express)=>{
    connectDb();
    app.use(express.json());
    app.use('/auth',authRouter);
    app.use('*',(req,res)=>{
        res.status(404).json({message:"page not found"})
    })
}

export default initApp;