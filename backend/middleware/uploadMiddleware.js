const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);

        cb(
            null,
            `${Date.now()}-${path.basename(
                file.originalname,
                extension
            )}${extension}`
        );
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    console.log("File received:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
    });

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    // Normal image MIME type
    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    // Postman may send application/octet-stream
    // Fall back to checking the file extension
    if (
        file.mimetype === "application/octet-stream" &&
        allowedExtensions.includes(extension)
    ) {
        return cb(null, true);
    }

    return cb(
        new Error(
            `Only image files are allowed. Received: ${file.mimetype}`
        ),
        false
    );
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;