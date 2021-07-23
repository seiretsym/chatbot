const tmi = require("tmi.js");
const axios = require("axios");
require("dotenv").config();
let scenes = [];
let queue = 0;

const headers = {
  Authorization: `Bearer ${process.env.LIFX_TOKEN}`
}

const opts = {
  identity: {
    username: "derpbothk",
    password: process.env.OAUTH_BOT_TOKEN
  },
  channels: ["derpwinhk"]
}

const client = new tmi.client(opts);
client.on("connected", (addr, port) => {
  console.log(`Bot connected to ${addr}:${port}`)
})

client.on("redeem", onRedeemHandler)

client.connect();

function onRedeemHandler(channel, username, rewardType, tags, msg) {
  console.log(tags);
  const color = msg.replace("#", "").toLowerCase().trim();

  switch (tags["custom-reward-id"]) {
    case "b92fc784-a410-4480-895e-c93204e9850e":
      queue++;
      setTimeout(() => {
        changeColor(color, tags.username)
      }, 120000 * (queue - 1))
      break;
    case "ff4fb9e8-c39a-4743-b026-14e90c382d14":
      const i = scenes.findIndex(scene => scene.name.toLowerCase() === color);
      if (i > -1) {
        queue++;
        setTimeout(() => {
          changeScene(i)
        }, 120000 * (queue - 1))
      } else {
        client.say("derpwinhk", `Sorry, @${tags.username}. "${color}" was an invalid theme. Please request a refund.`)
      }
      break;
    default:
      // do nothing
      return;
  }
}

function changeColor(color, username) {
  axios({
    method: "PUT",
    url: "https://api.lifx.com/v1/lights/all/state",
    headers: headers,
    params: {
      color: color,
      brightness: 0.75,
      duration: 3
    }
  }).then(() => {
    setTimeout(() => {
      queue--;
    }, 120000 * queue)
  }).catch(() => {
    queue--;
    client.say("derpwinhk", `Sorry, @${username}. "${color}" was not a valid color. Please request a refund.`)
  })
}

function changeScene(i) {
  const uuid = scenes[i].uuid;
  axios({
    method: "PUT",
    url: `https://api.lifx.com/v1/scenes/scene_id:${uuid}/activate`,
    headers: headers,
    params: {
      duration: 3
    }
  }).then(() => {
    moveEffect();
    setTimeout(() => {
      queue--;
    }, 120000 * queue)
  })
}

function moveEffect() {
  axios({
    method: "POST",
    url: "https://api.lifx.com/v1/lights/all/effects/move?direction=forward&period=10",
    headers: headers
  }).then(() => {
    console.log("moveEffect activated!");
  })
}

// get scenes from lifx
axios({
  method: "GET",
  url: "https://api.lifx.com/v1/scenes",
  headers: headers
}).then(({ data }) => {
  scenes = [...data];
  // console.log(scenes);
})