import { configDotenv } from 'dotenv';
import { z } from 'zod';

configDotenv();

// Define a Zod schema for environment variables
const envSchema = z.object({
  PORT: z.string().nonempty('PORT is required').transform(Number),
  MONGO_URI: z.string().url('MONGO_URI must be a valid URL'),
  JWT_SECRET: z.string().nonempty('JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().nonempty('JWT_EXPIRES_IN is required'),
  JWT_COOKIE_EXPIRES_IN: z
    .string()
    .nonempty('JWT_COOKIE_EXPIRES_IN is required'),
  GMAIL_User: z.string().email('GMAIL_User must be a valid email'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  NODE_ENV: z.enum(
    ['development', 'production', 'test'],
    "NODE_ENV must be one of 'development', 'production', or 'test'"
  ),
  GMAIL_Password: z.string().nonempty('GMAIL_Password is required'),
  isDevelopment: z.string().transform((val) => val === 'true'),
  GEMINI_API_KEY: z.string().optional(),
  Cloudinary_Cloud_Name: z
    .string()
    .nonempty('Cloudinary_Cloud_Name is required'),
  Cloudinary_API_Key: z.string().nonempty('Cloudinary_API_Key is required'),
  Cloudinary_API_Secret: z
    .string()
    .nonempty('Cloudinary_API_Secret is required'),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    'Environment variable validation failed:',
    parsedEnv.error.format()
  );
  process.exit(1); // Exit the application if validation fails
}

const env_Constant = {
  PORT: parsedEnv.data.PORT,
  MONGO_URI: parsedEnv.data.MONGO_URI,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsedEnv.data.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: parsedEnv.data.JWT_COOKIE_EXPIRES_IN,
  GMAIL_User: parsedEnv.data.GMAIL_User,
  FRONTEND_URL: parsedEnv.data.FRONTEND_URL,
  NODE_ENV: parsedEnv.data.NODE_ENV,
  GMAIL_Password: parsedEnv.data.GMAIL_Password,
  isDevelopment: parsedEnv.data.isDevelopment,
  GEMINI_API_KEY: parsedEnv.data.GEMINI_API_KEY,
  cloud_name: parsedEnv.data.Cloudinary_Cloud_Name,
  api_key: parsedEnv.data.Cloudinary_API_Key,
  api_secret: parsedEnv.data.Cloudinary_API_Secret,
};

export default Object.freeze(env_Constant);
