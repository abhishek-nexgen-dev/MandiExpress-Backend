import Otp from './Otp.Schema.mjs';
import OtpUtils from './Otp.Utils.mjs';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import { Gmail } from '../../../utils/SendMail.mjs';

class OtpService {
  async generateOtp(email) {
    const otp = await OtpUtils.generateOTP();
    const expiresAt = OtpUtils.getExpiryTime(5);

    await Otp.create({ email, otp, expiresAt });

    return otp;
  }

  async validateOtp(email, otp) {
    try {
      const otpRecord = await Otp.findOne({ email, otp });

      if (!otpRecord) {
        throw new Error('Invalid OTP or email.');
      }

      if (otpRecord.expiresAt < new Date()) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return false;
      }

      await Otp.deleteOne({ _id: otpRecord._id });
      return true;
    } catch (error) {
      throw Error(`Error validating OTP: ${error.message}`);
    }
  }

  startOtpCleanupJob() {
    cron.schedule('* * * * *', async () => {
      console.log('Running OTP cleanup job...');
      const result = await Otp.deleteMany({ expiresAt: { $lt: new Date() } });
      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired OTP(s).`);
      }
    });
  }

  async sendOtpEmail(email, otp, name) {
    try {
      const templatePath = path.join(
        path.resolve(),
        'src',
        'api',
        'v1',
        'Otp',
        'Template',
        'Otp.template.html'
      );

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
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      throw Error(error.message || AuthConstant.OTP_SEND_FAILED);
    }
  }
}

export default new OtpService();
