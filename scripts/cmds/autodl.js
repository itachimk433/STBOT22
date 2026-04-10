<<<<<<< HEAD
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const stbotApi = new global.utils.STBotApis();

module.exports = {
  config: {
    name: "autodl",
    aliases: [],
    version: "2.4.77",
    author: "ST | Sheikh Tamim",
    countDown: 5,
    role: 0,
    shortDescription: "Auto download videos from 12+ platforms",
    longDescription: "",
    category: "media",
    guide: {
      en: `Auto download from 12+ platforms: TikTok, Facebook, Instagram, YouTube, Twitter, Pinterest, Reddit, LinkedIn, CapCut, Douyin, Snapchat, Threads, Tumblr`,
    },
  },

  onStart: () => {},

  onChat: async function ({ message, event, usersData }) {
    const url = event.body?.trim() || "";
    if (!url) return;

    try {
      const supportedPlatforms = [
        "vt.tiktok.com", "www.tiktok.com", "vm.tiktok.com",
        "facebook.com", "fb.watch",
        "instagram.com",
        "youtu.be", "youtube.com",
        "x.com", "twitter.com",
        "pin.it", "pinterest.com",
        "reddit.com", "redd.it",
        "linkedin.com",
        "capcut.com",
        "douyin.com",
        "snapchat.com",
        "threads.net",
        "tumblr.com"
      ];

      const urlPattern = /(?:https?:\/\/)?[^\s]+/gi;
      const urls = url.match(urlPattern);
      if (!urls || urls.length === 0) return;

      // Ensure URL has protocol
      const validUrl = urls.find(u => {
        const urlToCheck = u.startsWith('http') ? u : `https://${u}`;
        return supportedPlatforms.some(domain => urlToCheck.toLowerCase().includes(domain));
      });

      if (!validUrl) return;

      // Add https if missing
      const finalUrl = validUrl.startsWith('http') ? validUrl : `https://${validUrl}`;

      if (!validUrl) return;

      const userData = await usersData.get(event.senderID);
      const userName = userData ? userData.name : "User";

      const startTime = Date.now();
      const pr = await message.pr(`⏳ Downloading your video, ${userName}... Please wait 😊`, "✅");

      // Check if it's a YouTube URL
      const isYouTube = finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be');

      let videoUrl, data;

      if (isYouTube) {
        // Use /audioytdlv1 for YouTube
        const apiUrl = `${stbotApi.baseURL}/audioytdlv1`;
        const payload = {
          url: finalUrl,
          format: "720"
        };

        const response = await axios.post(apiUrl, payload, {
          headers: stbotApi.getHeaders(true)
        });

        data = response.data;
        if (!data?.success || !data?.downloadUrl) {
          throw new Error("No video found or download failed.");
        }

        videoUrl = data.downloadUrl;
      } else {
        // Use /api/download/auto for other platforms
        const apiUrl = `${stbotApi.baseURL}/api/download/auto`;
        const response = await axios.post(apiUrl, { url: finalUrl }, {
          headers: stbotApi.getHeaders(true)
        });

        data = response.data;
        if (!data?.success || !data?.data?.videos?.length) {
          throw new Error("No video found or download failed.");
        }

        videoUrl = data.data.videos[0];
      }


      const fileExt = path.extname(videoUrl.split("?")[0]) || ".mp4";
      const cacheDir = path.join(__dirname, "cache");
      const filePath = path.join(cacheDir, `download${fileExt}`);

      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const media = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(media.data, "binary"));

      const tinyUrlResponse = await axios.get(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoUrl)}`
      );

      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      await pr.success();

      await message.reply({
        body: `✅ Downloaded from ${data.platform?.toUpperCase() || "UNKNOWN"}\n🔗 Link: ${tinyUrlResponse.data}\n⏱️ Time taken: ${timeTaken}s`,
        attachment: fs.createReadStream(filePath),
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("Download error:", err);
      const pr = await message.pr("Processing failed...");
      await pr.error(
        `❌ Error: ${err.message}\n\nSupported platforms:\nTikTok, Facebook, Instagram, YouTube, Twitter, Pinterest, Reddit, LinkedIn, CapCut, Douyin, Snapchat, Threads, Tumblr`
      );
    }
  },
};
=======
const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

module.exports = {
    config: {
        name: "autolink",
        version: "1.3",
        author: "MOHAMMAD AKASH",
        countDown: 5,
        role: 0,
        shortDescription: "Auto-download & send videos silently (no messages)",
        category: "media",
    },

    onStart: async function () {},

    onChat: async function ({ api, event }) {
        const threadID = event.threadID;
        const messageID = event.messageID;
        const message = event.body || "";

        const linkMatches = message.match(/(https?:\/\/[^\s]+)/g);
        if (!linkMatches || linkMatches.length === 0) return;

        const uniqueLinks = [...new Set(linkMatches)];

        api.setMessageReaction("⏳", messageID, () => {}, true);

        let successCount = 0;
        let failCount = 0;

        for (const url of uniqueLinks) {
            try {
                const { title, filePath } = await downloadVideo(url);
                if (!filePath || !fs.existsSync(filePath)) throw new Error();

                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) {
                    fs.unlinkSync(filePath);
                    failCount++;
                    continue;
                }

                await api.sendMessage(
                    {
                        body:
`📥 ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ
━━━━━━━━━━━━━━━
🎬 ᴛɪᴛʟᴇ: ${title || "Video File"}
📦 sɪᴢᴇ: ${fileSizeInMB.toFixed(2)} MB
━━━━━━━━━━━━━━━`,
                        attachment: fs.createReadStream(filePath)
                    },
                    threadID,
                    () => fs.unlinkSync(filePath)
                );

                successCount++;

            } catch {
                failCount++;
            }
        }

        const finalReaction =
            successCount > 0 && failCount === 0 ? "✅" :
            successCount > 0 ? "⚠️" : "❌";

        api.setMessageReaction(finalReaction, messageID, () => {}, true);
    }
};
>>>>>>> 9bbaa51 (update)
