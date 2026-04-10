<<<<<<< HEAD
const fs = require('fs');

module.exports = {
  config: {
    name: "file",
    version: "2.0",
    author: "ST | Sheikh Tamim",
    countDown: 2,
    role: 2, // Only bot admin
    shortDescription: "Send bot script file",
    longDescription: "Send the content of a specified bot script file",
    category: "owner",
    guide: "{pn} <file name>\nEx: {pn} fileName"
  },

  onStart: async function ({ message, args, api, event, usersData }) {
    const { threadID, senderID, messageID } = event;
    
    // Bot Admin check
    const botAdmins = global.GoatBot.config?.ADMINBOT || [];//in to this box u and manual set user uid or others user uid for whos can just get access this command
    if (!botAdmins.includes(senderID)) {
      return api.sendMessage("⛔ You are not authorized to use this command.", threadID, messageID);
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("⚠️ Please provide a file name.\nExample: .file index", threadID, messageID);
    }

    const filePath = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`❌ File not found: ${fileName}.js`, threadID, messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: `📂 Content of ${fileName}.js:\n\n${fileContent}` }, threadID);
  }
=======
const fs = require("fs-extra");
const path = require("path");

module.exports = {
        config: {
                name: "file",
                aliases: [],
                version: "1.2",
                author: "NeoKEX",
                countDown: 5,
                role: 4,
                description: {
                        vi: "Xem mã nguồn của một lệnh cụ thể",
                        en: "View the source code of a specific command"
                },
                category: "system",
                guide: {
                        vi: "   {pn} <tên lệnh>: xem mã nguồn của lệnh",
                        en: "   {pn} <command name>: view source code of the command"
                }
        },

        onStart: async function ({ args, message }) {
                if (!args.length) {
                        return message.SyntaxError();
                }

                const commandName = args[0].toLowerCase();
                const allCommands = global.GoatBot.commands;

                let command = allCommands.get(commandName);
                if (!command) {
                        const cmd = [...allCommands.values()].find((c) =>
                                (c.config.aliases || []).includes(commandName)
                        );
                        command = cmd;
                }

                if (!command) {
                        return message.reply("❌ Command not found");
                }

                const actualCommandName = command.config.name;
                
                if (!/^[a-zA-Z0-9_-]+$/.test(actualCommandName)) {
                        return message.reply("❌ Invalid command name");
                }

                const allowedDir = path.resolve(__dirname);
                const filePath = path.resolve(__dirname, `${actualCommandName}.js`);
                
                if (!filePath.startsWith(allowedDir)) {
                        return message.reply("❌ Access denied: Path traversal detected");
                }

                try {
                        if (!fs.existsSync(filePath)) {
                                return message.reply("❌ File not found");
                        }

                        const content = fs.readFileSync(filePath, "utf-8");
                        
                        if (content.length > 4000) {
                                return message.reply(`${content.substring(0, 3997)}...`);
                        }
                        
                        return message.reply(`${content}`);

                } catch (err) {
                        return message.reply(`❌ Error: ${err.message}`);
                }
        }
>>>>>>> 9bbaa51 (update)
};
