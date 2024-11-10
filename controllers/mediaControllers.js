const {  PrismaClient } = require("@prisma/client");
const imageKit = require("../libs/imageKit");
const prisma = new PrismaClient();


class mediaControllers {

    static async addImage(req,res){
        try {
            // Mencegah upload tanpa file / file 0
            if (!req.file || req.length === 0){
                return res.status(400).json({
                    message: 'bad request',
                    error: 'No file uploaded'
                });
            };

            let stringFile = req.file.buffer.toString('base64');

            const fileName = req.body.judul || req.file.originalname;
            //Upload Imagekit.io
            const uploadImage = await imageKit.upload({
                fileName: fileName,
                file: stringFile
            })
            console.log(uploadImage, "===> INI uploadImage");
            
            //Upload database prisma postgresql
            if (uploadImage) {
                const resultAdd = await prisma.image.create({
                    data: {
                        judul: fileName,
                        imageUrl: uploadImage.url,
                        fileId: uploadImage.fileId, 
                        deskripsi: req.body.deskripsi || "deskripsi tempelan" //kalo ga masukin deskripsi otomatis diisi string ini
                    }
                })
                console.log(resultAdd, "===> INI resultAdd");
                
                res.status(201).json({
                    message: "image berhasil diupload",
                    data: {
                        imagekitName: uploadImage.name,
                        fileId: uploadImage.fileId, //fileId digunakan utk menghapus image di imagekit.io
                        prisma: resultAdd
                    }
                });
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
            const findImage = await prisma.image.findUnique({
                where: { id: Number(imageId) }
            });
            if (!findImage) {
                return res.status(400).json({
                    message: "gagal mencari image"
                })
            }
            
            res.status(200).json({
                message: "image ditemukan",
                data: findImage
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
            //Mencari image
            const findImage = await prisma.image.findUnique({
                where: { id: Number(imageId) }
            });
            if (!findImage) {
                return res.status(400).json({
                    message: "gagal mencari image"
                })
            }

            //Mengupdate image
            const updatedImageKit = await imageKit.updateFileDetails(findImage.fileId, {
                name: judul || findImage.judul,
            })
            console.log(updatedImageKit, "===> INI updatedImageKit");

            const updatedImage = await prisma.image.update({
                where: { id: Number(imageId) },
                data: {
                        judul: judul || findImage.judul,
                        deskripsi: deskripsi
                }
            })
            res.status(200).json({
                message: "image berhasil diupdate",
                data: {
                    imagekit: updatedImageKit,
                    prisma: updatedImage
                }
            })
        } catch (error) {
            console.log(error, '===> INI ERROR');
            res.status(500).json({
                message: "image tidak ditemukan"
            })
        }
    }

    static async deleteImage(req,res){
        const { imageId, fileId } = req.params;
        try {
            const findImage = await prisma.image.findUnique({
                where: { id: Number(imageId) }
            });
            if (!findImage) {
                return res.status(400).json({
                    message: "gagal mencari image"
                })
            }

            //Menghapus data di imagekit.io
            await imageKit.deleteFile(fileId).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
            });

            //Menghapus data di prisma
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