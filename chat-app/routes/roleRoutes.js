const express = require('express');
const roleController = require('../controllers/roleController');

const router = new express.Router();

router.post('/create', roleController.createRole);

module.exports = router;
