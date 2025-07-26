import fs from 'fs';
import path from 'path';
import AuthConstant from './Auth.constant.mjs';
import { Gmail } from '../../../utils/SendMail.mjs';
import { console } from 'inspector';

class AuthService {
  async sendOTP(email, otp, name) {
    

    try {
 
  
      const templatePath = path.join(path.resolve(),'src', 'api', 'v1', 'Auth', 'Template', 'Otp.template.html');
 

      let emailTemplate = fs.readFileSync(templatePath, 'utf-8');
      if (!emailTemplate) {
        throw new Error('Email template not found.');
      }

      // Replace placeholders with dynamic values
      emailTemplate = emailTemplate
        .replace('{{Name}}', name)
        .replace('{{otp}}', otp);

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'You are Trying to Sign In or Sign Up',
        html: emailTemplate,
      };

    
      const transporter = Gmail(); 
      if (!transporter) {
        throw new Error('Failed to initialize email transporter.');
      }

      await transporter.sendMail(mailOptions);

      console.log(`OTP sent to ${email}: ${otp}`);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      throw  Error(error.message || AuthConstant.OTP_SEND_FAILED);
    }
  }
}

export default new AuthService();
