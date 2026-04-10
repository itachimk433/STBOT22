<<<<<<< HEAD
const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    aliases: ["song"],
    version: "2.4.78",
    author: "ST | Sheikh Tamim",
    role: 0,
    category: "music"
  },

  ST: async function ({ message, args, event, usersData }) {
    const stapi = new global.utils.STBotApis();

    if (!args[0]) {
      return message.reply("🎵 Enter song name");
    }


    let showList = false;

    if (args[0] === "-s") {
      showList = true;
      args.shift();
    }

    const query = args.join(" ");
    if (!query) return message.reply("❌ Enter song name");

    const userName = await usersData.getName(event.senderID);
    const processing = await message.reply(`⏳ Searching "${query}"...`);

    try {
      const search = await yts(query);
      if (!search.videos.length) {
        await message.unsend(processing.messageID);
        return message.reply("❌ No results found");
      }


      if (!showList) {
        const v = search.videos[0];

        await message.unsend(processing.messageID);

        const dlMsg = await message.reply(`⬇️ Downloading: ${v.title}`);

        const res = await axios.post(`${stapi.baseURL}/audioytdlv1`, {
          url: v.url,
          format: "mp3"
        });

        if (!res.data?.downloadUrl) {
          await message.unsend(dlMsg.messageID);
          return message.reply("❌ Download failed");
        }

        const audio = await axios.get(res.data.downloadUrl, {
          responseType: "arraybuffer"
        });

        const file = path.join(__dirname, "cache", `audio_${Date.now()}.mp3`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, Buffer.from(audio.data));

        await message.unsend(dlMsg.messageID);

        await message.reply({
          body:
            `🎶 ${v.title}\n` +
            `👤 ${v.author.name}\n` +
            `⏱ ${v.timestamp}`,
          attachment: fs.createReadStream(file)
        });

        fs.unlinkSync(file);
        return;
      }


      const top = search.videos.slice(0, 6);

      let msg = `🔍 Results for "${query}"\n\n`;

      top.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n⏱ ${v.timestamp}\n\n`;
      });

      msg += "👉 Reply with number";

      await message.unsend(processing.messageID);

      return message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          author: event.senderID,
          videos: top
        });
      });

    } catch (e) {
      console.error(e);
      await message.unsend(processing.messageID);
      return message.reply("❌ Error: " + e.message);
    }
  },


  onReply: async function ({ message, event, Reply, usersData }) {
    if (event.senderID !== Reply.author) {
      return message.reply("⚠️ Not your request");
    }

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > Reply.videos.length) {
      return message.reply("❌ Invalid choice");
    }

    const stapi = new global.utils.STBotApis();
    const video = Reply.videos[choice - 1];

    const userName = await usersData.getName(event.senderID);

    const dlMsg = await message.reply(`⬇️ Downloading: ${video.title}`);

    try {
      const res = await axios.post(`${stapi.baseURL}/audioytdlv1`, {
        url: video.url,
        format: "mp3"
      });

      if (!res.data?.downloadUrl) {
        await message.unsend(dlMsg.messageID);
        return message.reply("❌ Download failed");
      }

      const audio = await axios.get(res.data.downloadUrl, {
        responseType: "arraybuffer"
      });

      const file = path.join(__dirname, "cache", `audio_${Date.now()}.mp3`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(audio.data));

      await message.unsend(dlMsg.messageID);

      await message.reply({
        body:
          `🎶 ${video.title}\n` +
          `👤 Requested by: ${userName}\n` +
          `⏱ ${video.timestamp}`,
        attachment: fs.createReadStream(file)
      });

      fs.unlinkSync(file);

    } catch (err) {
      console.error(err);
      await message.unsend(dlMsg.messageID);
      return message.reply("❌ Download error");
    }
  }
};
=======
const a = require("axios");
const b = require("fs");
const c = require("path");
const d = require("yt-search");

const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

async function getStream(url) {
  const res = await a({ url, responseType: "stream" });
  return res.data;
}

async function downloadSong(baseApi, url, api, event, title = null) {
  try {
    const apiUrl = `${baseApi}/play?url=${encodeURIComponent(url)}`;
    const res = await a.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.downloadUrl) throw new Error("API failed to return download URL.");

    const songTitle = title || data.title;
    const fileName = `${songTitle}.mp3`.replace(/[\\/:"*?<>|]/g, "");
    const filePath = c.join(__dirname, fileName);

    const songData = await a.get(data.downloadUrl, { responseType: "arraybuffer" });
    b.writeFileSync(filePath, songData.data);

    await api.sendMessage(
      { body: `• ${songTitle}`, attachment: b.createReadStream(filePath) },
      event.threadID,
      () => b.unlinkSync(filePath),
      event.messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage(`❌ Failed to download song: ${err.message}`, event.threadID, event.messageID);
  }
}

module.exports = {
  config: {
    name: "song",
    aliases: ["music", "sing"],
    version: "0.0.1",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    shortDescription: "Sing tomake chai",
    longDescription: "Search and download music from YouTube",
    category: "MUSIC",
    guide: "/play <song name or YouTube URL>"
  },

  onStart: async function ({ api: e, event: f, args: g, commandName: cmd }) {
    let baseApi;
    try {
      const configRes = await a.get(nix);
      baseApi = configRes.data && configRes.data.api;
      if (!baseApi) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      return e.sendMessage("❌ Failed to fetch API configuration from GitHub.", f.threadID, f.messageID);
    }

    if (!g.length) return e.sendMessage("❌ Provide a song name or YouTube URL.", f.threadID, f.messageID);

    const aryan = g;
    const query = aryan.join(" ");
    if (query.startsWith("http")) return downloadSong(baseApi, query, e, f);

    try {
      const res = await d(query);
      const results = res.videos.slice(0, 6);
      if (!results.length) return e.sendMessage("❌ No results found.", f.threadID, f.messageID);

      let msg = "";
      results.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n⏱ ${v.timestamp} | 👀 ${v.views}\n\n`;
      });

      const thumbs = await Promise.all(results.map(v => getStream(v.thumbnail)));

      e.sendMessage(
        { body: msg + "Reply with number (1-6) to download song", attachment: thumbs },
        f.threadID,
        (err, info) => {
          if (err) return console.error(err);
          global.GoatBot.onReply.set(info.messageID, {
            results,
            messageID: info.messageID,
            author: f.senderID,
            commandName: cmd,
            baseApi
          });
        },
        f.messageID
      );
    } catch (err) {
      console.error(err);
      e.sendMessage("❌ Failed to search YouTube.", f.threadID, f.messageID);
    }
  },

  onReply: async function ({ api: e, event: f, Reply: g }) {
    const results = g.results;
    const baseApi = g.baseApi;
    if (!baseApi) return e.sendMessage("❌ Session expired. Please restart the command.", f.threadID, f.messageID);

    const choice = parseInt(f.body);

    if (isNaN(choice) || choice < 1 || choice > results.length) {
      return e.sendMessage("❌ Invalid selection.", f.threadID, f.messageID);
    }

    const selected = results[choice - 1];
    await e.unsendMessage(g.messageID);

    downloadSong(baseApi, selected.url, e, f, selected.title);
  }
};
>>>>>>> 9bbaa51 (update)
