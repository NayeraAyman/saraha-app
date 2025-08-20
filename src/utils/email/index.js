import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //send mail
  await transporter.sendMail({
    from: "'saraha app'<nayeraaymanahmed@gmail.com>",
    to: to,
    subject: subject,
    html: html,
  });
}
