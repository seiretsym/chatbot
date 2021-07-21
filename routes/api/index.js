const router = require('express').Router();
const twitch = require('./twitch');

// connect api routers
router.use("/twitch", twitch);

module.exports = router;