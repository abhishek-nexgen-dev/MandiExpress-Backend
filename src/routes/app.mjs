import express from 'express';
const app = express();


import cookieParser from 'cookie-parser';
import { userRoutes } from '../api/v1/user/user.routes.mjs';
import { aiRoutes } from '../api/v1/ai/ai.routes.mjs';
import { AuthRouter } from '../api/v1/Auth/Auth.routes.mjs';
import { OtpRouter } from '../api/v1/Otp/Otp.routes.mjs';



app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/api',
    userRoutes,
    aiRoutes,
    AuthRouter,
    OtpRouter
)



export default app;