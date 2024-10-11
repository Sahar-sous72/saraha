import { Router } from "express";
const app =Router();
import * as authController from './auth.controller.js'
import validation from "../../midlleware/validation.js";
import { LoginSchema, registerSchema } from "./auth.validation.js";
import { auth } from "../../midlleware/auth.js";

app.post('/register',validation(registerSchema),authController.register);
app.post('/login',validation(LoginSchema),authController.login);
app.get('/allUsers',auth,authController.getAllUsers)


export default app;