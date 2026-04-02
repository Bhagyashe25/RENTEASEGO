import express from 'express'
import { getUserData, loginUser, registerUser, submitMaintenanceRequest, getMaintenanceRequests, } from "../controllers/userController.js";
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.post("/maintenance-request", protect, submitMaintenanceRequest);
userRouter.get("/maintenance-requests", protect, getMaintenanceRequests);

export default userRouter