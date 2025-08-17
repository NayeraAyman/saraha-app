import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "node:fs";
export const fileUpload = ({
  folder,
  allowedType = ["image/jpeg", "image/png"],
} = {}) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      let dest = `uploads/${req.user._id}/${folder}`;
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      cb(null, nanoid() + "_" + file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (allowedType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format", { cause: 400 }));
    }
  };
  return multer({ storage, fileFilter });
};
