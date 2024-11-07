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
                        deskripsi: req.body.deskripsi || "ini adalah gambar" //kalo ga masukin deskripsi otomatis diisi string ini
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
            res.status(500).json({
                message: "gagal menambah image"
            })
        }
    }

    static async getAllImage(req,res){
        try {
            const images = await prisma.image.findMany({
                orderBy: {id: "asc"}
            });

            res.status(200).json({
                message: "berhasil menampilkan semua image",
                data: images
            })
        } catch (error) {
            console.log(error, '===> INI ERROR');
            res.status(500).json({
                message: "gagal menampilkan daftar image"
            })
        }
    }

    static async getImageById(req,res){
        const { imageId } = req.params;
        try {
            const images = await prisma.image.findMany({
                where: { id: Number(imageId) }
            })
            res.status(200).json({
                message: "image ditemukan",
                data: images
            });
        } catch (error) {
            console.log(error, '===> INI ERROR');
            res.status(500).json({
                message: "image tidak ditemukan"
            })
        }
    }

    static async updateImage(req,res){
        const { imageId } = req.params;
        const { judul, deskripsi } = req.body;

        try {
            const updatedImage = await prisma.image.update({
                where: { id: Number(imageId) },
                data: {
                        judul,
                        deskripsi
                }
            })
            res.status(200).json({
                message: "image berhasil diupdate",
                data: updatedImage
            })
        } catch (error) {
            console.log(error, '===> INI ERROR');
            res.status(500).json({
                message: "image tidak ditemukan"
            })
        }
    }

    static async deleteImage(req,res){
        const { imageId } = req.params;
        try {
            await prisma.image.delete({
                where: { id: Number(imageId) }
            });

            res.status(200).json({
                message: "Image berhasil dihapus"
            });
        } catch (error) {
            console.log(error, '===> INI ERROR');
            res.status(500).json({
                message: "gagal menghapus image"
            });
        }
    }

}


module.exports = mediaControllers;