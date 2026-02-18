const express = require('express');
const {
  createPG,
  getPGs,
  getPGById,
  updatePG,
  deletePG,
  getPGRooms,
} = require('../controllers/pgController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getPGs);
router.get('/:id', getPGById);
router.get('/:id/rooms', getPGRooms);

// Owner routes
router.post('/', protect, authorize('Owner'), createPG);
router.put('/:id', protect, authorize('Owner'), updatePG);
router.delete('/:id', protect, authorize('Owner'), deletePG);

module.exports = router;
