import { diskStorage } from 'multer';
import { extname } from 'path';
export const multerConfig = {
    storage: diskStorage({
        destination: './uploads/invoices',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return callback(new Error('Only PDF files are allowed!'), false);
        }
        callback(null, true);
    },
};
