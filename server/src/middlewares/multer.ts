import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import config from '@/config';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, config.uploadPath);
},
    filename: (req, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname)); 
}});

export const upload = multer({ storage });