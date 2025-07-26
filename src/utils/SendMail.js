import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export let createTransport = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.GMAIL_User,
        pass: process.env.GMAIL_Password,
      },
    });

    return transporter;
  } catch (error) {
    console.error(error.message);
  }
};
