const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// const fileFilter = (req, file, cb) => {
//     console.log("File received:", {
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//     });

//     const allowedTypes = [
//         "image/jpeg",
//         "image/png",
//         "image/jpg",
//         "image/webp",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
//     }
// };

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;