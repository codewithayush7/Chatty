import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    // 🔥 CRITICAL FIXES
    family: 4, // force IPv4
    tls: {
      rejectUnauthorized: true,
    },
  });

  await transporter.sendMail({
    from: "Chatty <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};
