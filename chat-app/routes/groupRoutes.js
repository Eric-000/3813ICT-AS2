const express = require('express');
const groupController = require('../controllers/groupController');
const checkPermissions = require('../middleware/checkPermissions');

const router = new express.Router();

router.post('/create', checkPermissions('Group Admin'), groupController.createGroup);
router.post('/assign', checkPermissions('Group Admin'), groupController.assignGroup);
router.get('/all', checkPermissions('Group Admin'), groupController.getGroups);
router.get('/group-admin/all', checkPermissions('Group Admin'), groupController.getGroupAdminGroups);
router.get('/super-admin/all', checkPermissions('Super Admin'), groupController.getSuperAdminGroups);
router.post('/delete', checkPermissions('Group Admin'), groupController.deleteGroup);
router.post('/leave', groupController.removeUserFromGroup);

module.exports = router;
