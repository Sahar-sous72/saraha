import { Router } from "express";
const app =Router();
import * as authController from './auth.controller.js'

app.post('/',authController.register);

export default app;