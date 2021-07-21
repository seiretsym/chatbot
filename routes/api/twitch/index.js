const router = require('express').Router();
const axios = require('axios');

// matches /api/twitch
router.route("/getChannelRedemptions")
  .get((req, res) => {
    axios({
      method: "GET",
      url: "https://api.twitch.tv/helix/channel_points/custom_rewards",
      headers: {
        Authorization: `Bearer ${req.session.user.token}`,
        "Client-Id": req.session.user.client_id
      },
      params: {
        broadcaster_id: req.session.user.user_id
      }
    })
      .then(({ data }) => {
        res.json(data);
      })
  })

// export routes
module.exports = router;