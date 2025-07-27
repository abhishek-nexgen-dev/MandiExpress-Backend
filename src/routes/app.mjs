import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
import { userRoutes } from '../api/v1/user/user.routes.mjs';
import { AuthRouter } from '../api/v1/Auth/Auth.routes.mjs';
import { OtpRouter } from '../api/v1/Otp/Otp.routes.mjs';
import { Supplier_Routes } from '../api/v1/supplier/supplier.routes.mjs';
import { VendorRoutes } from '../api/v1/vendor/vendor.routes.mjs';

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  '/api',
  userRoutes,
  AuthRouter,
  OtpRouter,
  Supplier_Routes,
  VendorRoutes
);

export default app;
