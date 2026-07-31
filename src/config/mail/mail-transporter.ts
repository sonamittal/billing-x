
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const mailTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });
};

export default mailTransporter;
