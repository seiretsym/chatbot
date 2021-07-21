const router = require('express').Router();
const path = require('path');
const auth = require('./auth');
const api = require('./api');

// connect api routers
router.use("/auth", auth);
router.use("/api", api);

// send index.html for production build
if (process.env.NODE_ENV === "production") {
  router.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
// export routes
module.exports = router;