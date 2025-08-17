import multer, { diskStorage } from "multer";

export const fileUpload = ({
  folder,
  allowedType = ["image/jpeg", "image/png"],
} = {}) => {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (allowedType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format", { cause: 400 }));
    }
  };
  return multer({ storage, fileFilter });
};
