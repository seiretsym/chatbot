const router = require('express').Router();
const path = require('path');
const axios = require("axios");

// matches /auth/twitch/
router.route("/")
  .get((req, res) => {
    const token = req.query.token;
    req.session.user = {
      token: token
    }
    res.send("ok");
  })

// matches /auth/twitch/callback
router.route("/code")
  .get((req, res) => {
    const code = req.query.code;

    axios({
      method: "POST",
      url: "https://id.twitch.tv/oauth2/token",
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/auth/twitch/token"
      }
    })
      .then(({ data }) => {
        req.session.user = {
          token: data.access_token
        }
        axios({
          method: "GET",
          url: "https://id.twitch.tv/oauth2/validate",
          headers: {
            Authorization: `OAuth ${req.session.user.token}`
          }
        })
          .then(({ data }) => {
            req.session.user = { ...req.session.user, ...data }
            console.log(req.session.user);
            res.sendFile(path.join(__dirname, "./redirect.html"));
          })
      })
  })
// export routes
module.exports = router;