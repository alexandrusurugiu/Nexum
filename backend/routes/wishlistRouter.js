const express = require('express');
const router = express.Router();
const { saveWishlist, getUserWishlists, getWishlistByCode } = require('../controllers/wishlistController');

router.post('/save', saveWishlist);
router.get('/user/:userId', getUserWishlists);
router.get('/code/:shareCode', getWishlistByCode);

module.exports = router;