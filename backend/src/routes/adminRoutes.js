const express = require('express');
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', adminController.adminLogin);
router.get('/users', protect, adminController.getAllUsers);
router.post('/users/:userId/verify', protect, adminController.verifyUserProfile);
router.get('/reports', protect, adminController.getReports);
router.post('/reports/:reportId/resolve', protect, adminController.resolveReport);
router.get('/stats', protect, adminController.getDashboardStats);

module.exports = router;
