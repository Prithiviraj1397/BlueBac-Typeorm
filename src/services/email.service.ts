import * as nodemailer from "nodemailer";
import config from '../config/config';

const transport = nodemailer.createTransport(config?.SMTP);

transport
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch(() =>
    console.error(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );

export const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = { from: config?.SMTP.auth.user, to, subject, text };
  await transport.sendMail(msg).then(info => console.log('Email Sent:', info?.messageId)).catch(e => console.log('Email Error:', e));
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = "Reset password";
  const resetPasswordUrl = `${config?.RESETPASSWORDLINK}?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export const sendVerificationEmail = async (to: string, token: string) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export const sendInviteEmail = async (to: string, token: string) => {
  const subject = "Invite Mail";
  const verificationEmailUrl = `${config?.INVITELINK}?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
}