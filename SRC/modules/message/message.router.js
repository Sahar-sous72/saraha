import {Router} from 'express'
import validation from '../../midlleware/validation.js';
import { auth } from '../../midlleware/auth.js';
import { sendMessageSchema } from './message.validation.js';
const app=Router();

import * as messageController from './message.controller.js'

app.post('/:recivedId',validation(sendMessageSchema),messageController.sendMessage)
app.get('/',auth,messageController.getMessages)

export default app;