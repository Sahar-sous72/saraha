import { Router } from "express";
const app =Router();
import * as authController from './auth.controller.js'
import validation from "../../midlleware/validation.js";
import { LoginSchema, registerSchema } from "./auth.validation.js";
import { auth } from "../../midlleware/auth.js";
import { asyncHandler } from "../../utils/catchError.js";
import fileUpload from "../../utils/multer.js";

app.post('/register',validation(registerSchema),asyncHandler(authController.register));
app.post('/login',validation(LoginSchema),asyncHandler(authController.login));
app.get('/allUsers',auth,asyncHandler(authController.getAllUsers));
//app.post('/uploadImage',fileUpload().single('image'),authController.UploadImage)
app.put('/uploadImage',fileUpload().single('image'),auth,authController.UploadImage) //put>>can edit , just for user who log in so put auth


export default app;