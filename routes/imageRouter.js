const router = require("express").Router();
const multer = require("../libs/multer");
const MediaControllers = require('../controllers/mediaControllers');
const mediaControllers = require("../controllers/mediaControllers");


router.post("/upload-image", multer.single('image'), MediaControllers.addImage);
router.get("/image-list", mediaControllers.getAllImage);
router.get("/image-list/:imageId", mediaControllers.getImageById);
router.put("/image-list/:imageId", mediaControllers.updateImage);
router.delete("/image-list/:imageId/:fileId", mediaControllers.deleteImage);



module.exports = router;