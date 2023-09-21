const express = require('express');
const groupController = require('../controllers/groupController');
const checkPermissions = require('../middleware/checkPermissions');

const router = new express.Router();

router.post('/create', checkPermissions('Group Admin'), groupController.createGroup);
router.post('/assign', checkPermissions('Group Admin'), groupController.assignGroup);

module.exports = router;
