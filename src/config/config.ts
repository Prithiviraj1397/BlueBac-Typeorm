import path from 'path';
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    ALLOWEDORIGIN: process.env.ALLOWEDORIGIN,
    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        RESETPASSWORDEXPIRETIME: process.env.JWT_RESETPASSWORDEXPIRETIME
    },
    SMTP: {
        service: 'gmail',
        auth: {
            user: 'mahespandi0321@gmail.com',
            pass: 'ndntrmbkntelhiks',
        }
    },
    RESETPASSWORDLINK: 'http://localhost:8000/forgetpassword',
    INVITELINK: 'http://localhost:8000/InviteUser'
}

export default config;
// MAIL: {
//     smtp: {
//       host: envVars.SMTP_HOST,
//       port: envVars.SMTP_PORT,
//       auth: {
//         user: envVars.SMTP_USERNAME,
//         pass: envVars.SMTP_PASSWORD,
//       },
//     },
//     from: envVars.EMAIL_FROM,
//   },