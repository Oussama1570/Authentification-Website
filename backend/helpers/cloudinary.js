const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dcca89ody",
  api_key:    "953223737728196",
  api_secret: "Bg9JJiv3-JFUHNO-2N4X2h6u7uA",
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadBufferToCloudinary = (buffer, folder = "authapp/avatars") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }] },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

module.exports = { cloudinary, upload, uploadBufferToCloudinary };
