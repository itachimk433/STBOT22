<<<<<<< HEAD
const axios = require('axios');
const ok = 'xyz';

module.exports = {
  config: {
    name: "p",
    aliases: ["prompt"],
    version: "1.2",
    author: "Team Calyx",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get gemini prompts."
    },
    category: "utility"
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      const promptText = args.join(" ");
      let imageUrl;
      let response;

      if (event.type === "message_reply") {
        if (["photo", "sticker"].includes(event.messageReply.attachments[0]?.type)) {
          imageUrl = event.messageReply.attachments[0].url;
        } else {
          return message.reply("❌ | Reply must be an image.");
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        imageUrl = args[0];
      } else if (!promptText) {
        return message.reply("❌ | Reply to an image or provide a prompt.");
      }

      if (["-r", "-random"].includes(promptText.toLowerCase())) {
        response = await axios.get(`https://smfahim.${ok}/prompt-random`);
        const description = response.data.data.prompt;
        await message.reply(description);
      } else if (["-anime", "-a"].some(flag => promptText.toLowerCase().includes(flag))) {
        // Use the new URL if the '-anime' or '-a' flag is present
        response = await axios.get(`https://smfahim.${ok}/prompt2?url=${encodeURIComponent(imageUrl || promptText)}`);
        if (response.data.code === 200) {
          const description = response.data.data;
          await message.reply(description);
        } else {
          await message.reply("❌ | Failed to retrieve prompt data.");
        }
      } else if (imageUrl) {
        response = await axios.get(`https://smfahim.${ok}/prompt?url=${encodeURIComponent(imageUrl)}`);
        const description = response.data.result;
        await message.reply(description);
      } else {
        response = await axios.get(`https://smfahim.${ok}/prompt?text=${encodeURIComponent(promptText)}`);
        const description = response.data.prompt || response.data.result;
        await message.reply(description);
      }

    } catch (error) {
      message.reply(`❌ | An error occurred: ${error.message}`);
    }
  }
};
=======
const axios = require("axios");

const configUrl = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "prompt",
    aliases: ["p"],
    version: "0.0.1",
    role: 0,
    author: "ArYAN",
    category: "ai",
    cooldowns: 5,
    guide: { en: "Reply to an image to generate Midjourney prompt" }
  },

  onStart: async ({ api, event }) => {
    const { threadID, messageID, messageReply } = event;

    let baseApi;
    try {
      const configRes = await axios.get(configUrl);
      baseApi = configRes.data && configRes.data.api;
      if (!baseApi) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      return api.sendMessage("❌ Failed to fetch API configuration from GitHub.", threadID, messageID);
    }

    if (
      !messageReply ||
      !messageReply.attachments ||
      messageReply.attachments.length === 0 ||
      !messageReply.attachments[0].url
    ) {
      return api.sendMessage("Please reply to an image.", threadID, messageID);
    }

    try {
      api.setMessageReaction("⏰", messageID, () => {}, true);

      const imageUrl = messageReply.attachments[0].url;
      const apiUrl = `${baseApi}/promptv2`;

      const apiResponse = await axios.get(apiUrl, {
        params: { imageUrl }
      });

      const result = apiResponse.data;

      if (!result.success) {
        throw new Error(result.message || "Prompt API failed.");
      }

      const promptText = result.prompt || "No prompt returned.";

      await api.sendMessage(
        { body: `${promptText}` },
        threadID,
        messageID
      );

      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);

      let msg = "Error while generating prompt.";
      if (e.response?.data?.error) msg = e.response.data.error;
      else if (e.message) msg = e.message;

      api.sendMessage(msg, threadID, messageID);
    }
  }
};
>>>>>>> 9bbaa51 (update)
