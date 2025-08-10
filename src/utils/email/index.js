import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "nayeraaymanahmed@gmail.com",
      pass: "zkeyfhgoqgxqfddy",
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
