const express = require('express');
const userController = require('../controllers/userController');
// const checkPermissions = require('../middleware/checkPermissions');

const router = new express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
// router.get('/users/:id', checkPermissions('read'), userController.getUser);

module.exports = router;