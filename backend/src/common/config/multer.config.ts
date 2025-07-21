import { diskStorage } from "multer";
import { extname, resolve } from "path";
import * as fs from 'fs'
import { HttpException, HttpStatus } from "@nestjs/common";

export const multerOptions = {
    storage: diskStorage({
        destination: (req, file, callback) => {
            const uploadPath = resolve('./uploads/products')
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true })
            }
            callback(null, uploadPath)
        },
        filename: (req, file, callback) => {
            const ext = extname(file.originalname);
            const uniqueName = `${Date.now()}${ext}`;
            callback(null, uniqueName)
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

        if (!allowedTypes.includes(file.mimetype)) {
            callback(null, false)
            throw new HttpException({
                code: 'INVALID_IMAGE', message: 'El tipo de imagen no es permitido', data: null
            }, HttpStatus.BAD_REQUEST)
        } else {
            callback(null, true)
        }
    }
}