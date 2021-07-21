const tmi = require("tmi.js");
const axios = require("axios");

const opts = {
  identity: {
    username: "derpbothk",
    password: process.env.OAUTH_BOT_TOKEN
  },
  channels: ["derpwinhk"]
}

const client = new tmi.client(opts);

client.on("message", onMessageHandler);
client.on("connected", (addr, port) => {
  console.log(`Bot connected to ${addr}:${port}`)
})

client.on("redeem", onRedeemHandler)

client.connect();

function onRedeemHandler(channel, username, rewardType, tags, msg) {
  console.log("channel", channel);
  console.log("username", username);
  console.log("rewardType", rewardType);
  console.log("tags", tags)
  console.log("msg", msg);

  const color = msg.trim();
  axios({
    method: "PUT",
    url: `https://api.lifx.com/v1/lights/all/state?power=on&color=${color}`,
    headers: {
      Authorization: `Bearer ${process.env.LIFX_TOKEN}`,
    }
  });
}