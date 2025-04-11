const express = require('express');
const {
    requestBook,
    completeTransaction,
    getPendingRequests,
    rejectRequest
} = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/request', authMiddleware, requestBook);
router.post('/complete', authMiddleware, completeTransaction);
router.post('/reject', authMiddleware, rejectRequest);
router.get('/pending-requests', authMiddleware, getPendingRequests);

module.exports = router;