import { Router } from "express";
const app =Router();
import * as authController from './auth.controller.js'

app.post('/register',authController.register);
app.post('/login',authController.login);


export default app;