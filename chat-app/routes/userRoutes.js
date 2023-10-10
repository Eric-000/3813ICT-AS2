const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const checkPermissions = require('../middleware/checkPermissions');
const path = require('path');
const fs = require('fs');

const router = new express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads');
      // create upload folder if not exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // set filename to be current timestamp + original filename
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/all', checkPermissions('Group Admin'), userController.getUsers);
router.post(
    '/uploadProfileImage',
    checkPermissions(),
    upload.single('profileImage'),
    userController.uploadProfileImage
  );
router.post('/assign-role', checkPermissions('Super Admin'), userController.assignRoleToUser);
router.delete('/delete', checkPermissions('User'), userController.deleteUser);

module.exports = router;