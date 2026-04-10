<<<<<<< HEAD
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const stbotApi = new global.utils.STBotApis();
=======
×cmd install gist.js const fs = require('fs');
const path = require('path');
const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json');
  return base.data.gist;
};
>>>>>>> 9bbaa51 (update)

module.exports = {
  config: {
    name: "gist",
<<<<<<< HEAD
    aliases: [],
    version: "2.4.78",
    author: "ST | Sheikh Tamim",
    countDown: 5,
    role: 0,
    description: "Upload code files to gist system",
    category: "utility",
    guide: {
      en:
        "   {pn} <filename.ext> <code>\n" +
        "   {pn} -c <filename>\n" +
        "   {pn} -e <filename>"
    }
  },

  ST: async function ({ message, args, event }) {

    if (!args[0]) {
      return message.reply(
        "📝 Gist Usage:\n\n" +
        "1. Direct upload:\n" +
        "   !gist file.js <code>\n\n" +
        "2. From path:\n" +
        "   !gist -c <filename>\n" +
        "   !gist -e <filename>"
      );
    }

    let filename, filePath, content;

    // ========================
    // 📁 COMMAND FILE (-c)
    // ========================
    if (args[0] === "-c") {
      if (!args[1]) {
        return message.reply("❌ Provide command filename");
      }

      filename = args[1].endsWith(".js") ? args[1] : args[1] + ".js";
      filePath = path.join(__dirname, filename);

      if (!fs.existsSync(filePath)) {
        return message.reply(`❌ File not found: ${filename}`);
      }

      content = fs.readFileSync(filePath, "utf-8");
    }

    // ========================
    // 📁 EVENT FILE (-e)
    // ========================
    else if (args[0] === "-e") {
      if (!args[1]) {
        return message.reply("❌ Provide event filename");
      }

      filename = args[1].endsWith(".js") ? args[1] : args[1] + ".js";
      filePath = path.join(__dirname, "../events", filename);

      if (!fs.existsSync(filePath)) {
        return message.reply(`❌ File not found: ${filename}`);
      }

      content = fs.readFileSync(filePath, "utf-8");
    }

    // ========================
    // 🧾 DIRECT CODE
    // ========================
    else {
      filename = args[0];

      if (!path.extname(filename)) {
        return message.reply("❌ File extension required");
      }

      content = event.body
        .slice(event.body.indexOf(filename) + filename.length + 1)
        .trim();

      if (!content) {
        return message.reply("❌ No code provided");
      }
    }

    // ========================
    // 🚀 API REQUEST
    // ========================
    try {
      const response = await axios.post(
        `${stbotApi.baseURL}/gist/files`,
        {
          filename: filename,
          content: content
        }
      );

      const res = response.data;

      if (res.success) {
        const data = res.data;

        return message.reply(
          `✅ Gist Uploaded Successfully & fully private !\n\n` +
          `📁 Name: ${data.name}\n` +
          `📦 Size: ${data.size} bytes\n` +
          `🔗 Download URL:\n${data.download_url}\n\n`
        );
      } else {
        return message.reply(`❌ Upload failed`);
      }

    } catch (err) {
      // 🔥 Better error debug
      if (err.response) {
        console.error("❌ STATUS:", err.response.status);
        console.error("❌ DATA:", err.response.data);
      }

      return message.reply(`❌ Error: ${err.message}`);
    }
  }
};
=======
    version: "2.0",
    role: 1,
    author: "Saimx69x",
    usePrefix: true,
    description: "Generate a Gist link from replied code or from local bot files",
    category: "convert",
    guide: { 
      en: "{pn} → Reply to a code snippet to create a Gist\n{pn} [filename] → Create a Gist from cmds folder\n{pn} -e [filename] → Create a Gist from events folder" 
    },
    countDown: 1
  },

  onStart: async function ({ api, event, args }) {
    let fileName = args[0];
    let code = "";

    try {
    
      if (event.type === "message_reply" && event.messageReply?.body) {
        code = event.messageReply.body;

        if (!fileName) {
          const time = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
          fileName = `gist_${time}.js`;
        } else if (!fileName.endsWith(".js")) {
          fileName = `${fileName}.js`;
        }
      } 
     
      else if (fileName) {
        let filePath;

        if (args[0] === "-e") {
          const evFile = args[1];
          if (!evFile) {
            return api.sendMessage("⚠ | Please provide a filename after -e.", event.threadID, event.messageID);
          }
          fileName = evFile.endsWith(".js") ? evFile : `${evFile}.js`;
          filePath = path.resolve(__dirname, '../../scripts/events', fileName);
        } else {
          const commandsPath = path.resolve(__dirname, '../../scripts/cmds');
          filePath = fileName.endsWith(".js")
            ? path.join(commandsPath, fileName)
            : path.join(commandsPath, `${fileName}.js`);
        }

        if (!fs.existsSync(filePath)) {
          const dirToSearch = args[0] === "-e"
            ? path.resolve(__dirname, '../../scripts/events')
            : path.resolve(__dirname, '../../scripts/cmds');

          const files = fs.readdirSync(dirToSearch);
          const similar = files.filter(f =>
            f.toLowerCase().includes(fileName.replace(".js", "").toLowerCase())
          );

          if (similar.length > 0) {
            return api.sendMessage(
              `❌ File not found. Did you mean:\n${similar.join('\n')}`,
              event.threadID,
              event.messageID
            );
          }

          return api.sendMessage(
            `❌ File "${fileName}" not found in ${args[0] === "-e" ? "events" : "cmds"} folder.`,
            event.threadID,
            event.messageID
          );
        }

        code = await fs.promises.readFile(filePath, "utf-8");
        if (!fileName.endsWith(".js")) fileName = `${fileName}.js`;
      } 
      else {
        return api.sendMessage("⚠ | Please reply with code OR provide a file name.", event.threadID, event.messageID);
      }

      const encoded = encodeURIComponent(code);
      const apiUrl = await baseApiUrl();

      const response = await axios.post(`${apiUrl}/gist`, {
        code: encoded,
        nam: fileName
      });

      const link = response.data?.data;
      if (!link) throw new Error("Invalid API response");

      const gistMsg = `${link}`;

      return api.sendMessage(gistMsg, event.threadID, event.messageID);

    } catch (err) {
      console.error("❌ Gist Error:", err.message || err);
      return api.sendMessage(
        "⚠️ Failed to create gist. Maybe server issue.\n💬 Contact author for help: https://m.me/ye.bi.nobi.tai.244493",
        event.threadID,
        event.messageID
      );
    }
  }
};
>>>>>>> 9bbaa51 (update)
