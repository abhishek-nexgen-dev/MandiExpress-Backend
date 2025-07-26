import express from 'express';
const app = express();


import cookieParser from 'cookie-parser';
import { userRoutes } from '../api/v1/user/user.routes.mjs';


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/api',
    userRoutes
)



export default app;