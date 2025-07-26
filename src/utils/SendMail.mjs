import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import envConstant from '../constant/env.constant.mjs';
import { transform } from 'zod';
dotenv.config();

export let Gmail = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: envConstant.GMAIL_User,
        pass: envConstant.GMAIL_Password,
      },
    });

    return transporter;
  } catch (error) {
    console.error(error.message);
  }
};





