import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
export const fileUpload = () => {
  const x = diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, nanoid() + "_" + file.originalname);
    },
  });
  return multer({ storage: x });
};
fileUpload();
