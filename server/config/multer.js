import multer from 'multer';

const storage = multer.memoryStorage(); // Change to memory storage

const upload = multer({ storage });

export default upload;