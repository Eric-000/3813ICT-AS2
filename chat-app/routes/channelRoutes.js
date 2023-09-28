const express = require('express');
const channelController = require('../controllers/channelController');
const checkPermissions = require('../middleware/checkPermissions');

const router = new express.Router();

router.post('/create', checkPermissions('Group Admin'), channelController.createChannel);

module.exports = router;