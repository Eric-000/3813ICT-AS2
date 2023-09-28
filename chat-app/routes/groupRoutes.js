const express = require('express');
const groupController = require('../controllers/groupController');
const checkPermissions = require('../middleware/checkPermissions');

const router = new express.Router();

router.post('/create', checkPermissions('Group Admin'), groupController.createGroup);
router.post('/assign', checkPermissions('Group Admin'), groupController.assignGroup);
router.get('/all', checkPermissions('Group Admin'), groupController.getGroups);

module.exports = router;
