import Otp from './Otp.Schema.mjs';
import OtpUtils from './Otp.Utils.mjs';
import cron from 'node-cron';

class OtpService {

  async generateOtp(email) {
    const otp = await OtpUtils.generateOTP(); 
    const expiresAt = OtpUtils.getExpiryTime(5); 

  
    await Otp.create({ email, otp, expiresAt });

    return otp;
  }


  async validateOtp(email, otp) {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return false; 
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id }); 
      return false; 
    }

 
    await Otp.deleteOne({ _id: otpRecord._id }); 
    return true;
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
}

export default new OtpService();