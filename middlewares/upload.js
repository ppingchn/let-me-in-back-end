const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
// module.exports = multer({dest: 'public/images'}) //ทำแบบกากๆ

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "public/pics"); //cb(error obj ,destinationที่จะให้รูปส่งไป)
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]); //cb(error obj ,ตั้งชื่อรูป ใช้uuidแทน เพราะถ้uploadรูปพร้อมกันมันจะerrorได้ และเติมจุด + ชนิดไฟล์)
  },
});

module.exports = multer({ storage });
