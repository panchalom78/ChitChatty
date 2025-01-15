// import multer from 'multer'

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './temp/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })

// const upload = multer({ storage })

// export default upload

import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const uploadMiddleware = multer({ storage }).single('photo');

const conditionalUpload = () => {
    return (req, res, next) => {
        if (req.body.photoLink) {
            // Skip multer if a photo link is present
            return next();
        }

        // Use multer to process the uploaded file
        uploadMiddleware(req, res, next);
    };
};
export default conditionalUpload;
