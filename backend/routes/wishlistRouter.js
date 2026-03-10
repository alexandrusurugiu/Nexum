const express = require('express');
const router = express.Router();
const { saveWishlist, getUserWishlists } = require('../controllers/wishlistController');

router.post('/save', saveWishlist);
router.get('/user/:userId', getUserWishlists);

module.exports = router;