const router = require("express").Router();
const multer = require("../libs/multer");
const MediaControllers = require('../controllers/mediaControllers');


router.post("/upload-image", multer.single('image'), MediaControllers.addImage);



module.exports = router;