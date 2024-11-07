const {  PrismaClient } = require("@prisma/client");
const imageKit = require("../libs/imagekit");
const prisma = new PrismaClient();


class mediaControllers {

    static async addImage(req,res){
        try {
            let stringFile = req.file.buffer.toString('base64');

            // Mencegah upload tanpa file / file 0
            if (!req.file || req.length === 0){
                res.status(400).json({
                    message: 'bad request',
                    error: 'No file uploaded'
                });
            };

            const uploadImage = await imageKit.upload({
                fileName: req.file.originalname,
                file: stringFile
            })
            console.log(uploadImage, "===> INI uploadImage");
            
            if (uploadImage) {
                const resultAdd = await prisma.image.create({
                    data: {
                        judul: req.body.judul || req.file.originalname,
                        imageUrl: uploadImage.url,
                        deskripsi: req.body.deskripsi || "ini adalah gambar" //sebagai default description
                    }
                })
                console.log(resultAdd, "===> INI resultAdd");
                
                res.status(201).json(resultAdd);
            }else{
                res.status(400).json({
                    message: 'bad request'
                })
            }
            

        } catch (error) {
            console.log(error, '===> INI ERROR addImage');
        }
    }

}


module.exports = mediaControllers;