import { connectDB } from "./DB/connection.js";
import authRouter from "../src/modules/auth/auth.controller.js";
import messageRouter from "../src/modules/message/message.controller.js";
import userRouter from "../src/modules/user/user.controller.js";
import cors from "cors";
import fs from "node:fs";
// import dotenv from "dotenv";
// dotenv.config({ path: "./config/local.env" });
export function bootstrap(app, express) {
  app.use(express.json());
  app.use(express.static("uploads"));

  app.use(
    cors({
      origin: "*",
    })
  );
  app.use("/auth", authRouter);
  app.use("/message", messageRouter);
  app.use("/user", userRouter);

  //global error handler
  app.use((err, req, res, next) => {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res
      .status(err.cause || 500)
      .json({ message: err.message, success: false, stack: err.stack });
  });

  connectDB();
}
