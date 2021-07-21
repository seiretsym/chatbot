const router = require('express').Router();
const twitch = require('./twitch');

// connect routes
router.use("/twitch", twitch);

module.exports = router;