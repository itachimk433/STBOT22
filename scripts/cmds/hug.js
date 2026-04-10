<<<<<<< HEAD
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
=======
const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs");
>>>>>>> 9bbaa51 (update)

module.exports = {
  config: {
    name: "hug",
<<<<<<< HEAD
    version: "1.1.0",
    author: "Rakib Adil",
    countDown: 5,
    role: 0,
    longDescription: "{p}hug @mention someone you want to hug that person 🫂",
    category: "funny",
    guide: "{p}hug and mention someone you want to hug 🥴",
    usePrefix: true,// you can use this command without prefix, juat set it to false.
    premium: false,
    notes: "If you change the author then the command will not work and not usable"
  },

  onStart: async function ({ api, message, event, usersData }) {
    const config = module.exports.config;
    const eAuth = "UmFraWIgQWRpbA==";
    const dAuth = Buffer.from(eAuth, "base64").toString("utf8");
    if (config.author !== dAuth) {
      return message.reply("⚠️ Command author mismatch. Please restore original author name to use this command.");
    }

    let one = event.senderID, two;
    const mention = Object.keys(event.mentions);
    
    if(mention.length > 0){
        two = mention[0];
    }else if(event.type === "message_reply") {
        two = event.messageReply.senderID;
    }else{
        message.reply("please mention or reply someone to hug")
    };

    try {
      const avatarURL1 = await usersData.getAvatarUrl(one);
      const avatarURL2 = await usersData.getAvatarUrl(two);

      const canvas = createCanvas(800, 750);
      const ctx = canvas.getContext("2d");

      const background = await loadImage("https://files.catbox.moe/qxovn9.jpg");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const avatar1 = await loadImage(avatarURL1);
      const avatar2 = await loadImage(avatarURL2);

      ctx.save();
      ctx.beginPath();
      ctx.arc(610, 340, 85, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar1, 525, 255, 170, 170);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(230, 350, 85, 0, Math.PI * 2); // Bigger & lower
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar2, 145, 265, 170, 170);
      ctx.restore();

      const outputPath = `${__dirname}/tmp/hug_image.png`;
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      message.reply(
        {
          body: "🫂 A warm hug 💞",
          attachment: fs.createReadStream(outputPath)
        },
        () => fs.unlinkSync(outputPath)
      );
    } catch (error) {
      console.error(error.message);
      api.sendMessage("⚠️ An error occurred, try again later.", event.threadID);
    }
  }
};
=======
    aliases: ["us", "抱"],
    version: "1.2",
    author: "AceGun, ChalresMK",
    countDown: 5,
    role: 0,
    shortDescription: "Send a hug",
    longDescription: "Hug someone with a cute image",
    category: "love",
    guide: {
      en: "{pn} [@tag] | {pn} [uid] | Reply to a message with {pn}"
    }
  },

  onStart: async function ({ api, message, event, args }) {
    let targetId;
    const senderId = event.senderID;

    // Method 1: Check if replying to a message
    if (event.messageReply) {
      targetId = event.messageReply.senderID;
    }
    // Method 2: Check for mentions (tags)
    else if (Object.keys(event.mentions).length > 0) {
      const mentions = Object.keys(event.mentions);
      targetId = mentions[0];
    }
    // Method 3: Check if a UID is provided as argument
    else if (args[0]) {
      // Validate if it's a numeric UID
      if (/^\d+$/.test(args[0])) {
        targetId = args[0];
      } else {
        return message.reply("Please provide a valid UID, tag someone, or reply to their message! 💕");
      }
    }
    // No valid target found
    else {
      return message.reply("Please mention someone, provide their UID, or reply to their message to hug them! 🤗");
    }

    // Don't allow hugging yourself
    if (targetId === senderId) {
      return message.reply("You can't hug yourself silly! Tag someone else 😄");
    }

    try {
      const path = await createHugImage(senderId, targetId, api);
      await message.reply({
        body: "Come here~ 🤗💕",
        attachment: fs.createReadStream(path)
      });

      // Clean up
      setTimeout(() => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }, 5000);

    } catch (err) {
      console.error("Hug error:", err);
      message.reply("Couldn't create the hug image... sorry 😔");
    }
  }
};

async function createHugImage(one, two, api) {
  let info1, info2;
  try {
    info1 = await api.getUserInfo(one);
    info2 = await api.getUserInfo(two);
  } catch (err) {
    console.error("getUserInfo failed:", err);
  }

  const url1 = info1?.profilePicture || `https://graph.facebook.com/${one}/picture?type=large`;
  const url2 = info2?.profilePicture || `https://graph.facebook.com/${two}/picture?type=large`;

  const avone = await jimp.read(url1);
  avone.circle();

  const avtwo = await jimp.read(url2);
  avtwo.circle();

  const template = await jimp.read("https://i.imgur.com/ReWuiwU.jpg");
  template.resize(466, 659);

  template.composite(avone.resize(110, 110), 150, 76);
  template.composite(avtwo.resize(100, 100), 245, 305);

  const outputPath = `${__dirname}/cache/hug_${Date.now()}.png`;
  await template.writeAsync(outputPath);

  return outputPath;
}
>>>>>>> 9bbaa51 (update)
