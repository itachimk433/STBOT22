<<<<<<< HEAD
module.exports = {
  config: {
    name: "pending",
    version: "1.0",
    author: "S A I M",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: ""
    },
    category: "Admin"
  },

  langs: {
    en: {
      invaildNumber: "%1 is not a valid number",
      cancelSuccess: "Refused %1 thread!",
      approveSuccess: "Approved successfully %1 threads!",
      cantGetPendingList: "Can't get the pending list!",
      returnListPending: "»「PENDING」«❮ The number of threads to approve: %1 ❯\n\n%2",
      returnListClean: "「PENDING」There is no thread in the pending list"
    }
  },

  onReply: async function ({ api, event, Reply, getLang, commandName }) {
    if (String(event.senderID) !== String(Reply.author)) return;
    const { body, threadID, messageID } = event;
    let count = 0;

    if ((isNaN(body) && body.indexOf("c") == 0) || body.indexOf("cancel") == 0) {
      const index = (body.slice(1)).split(/\s+/);
      for (const i of index) {
        if (isNaN(i) || i <= 0 || i > Reply.pending.length)
          return api.sendMessage(getLang("invaildNumber", i), threadID, messageID);
        api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[i - 1].threadID);
        count++;
      }
      return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    } else {
      const index = body.split(/\s+/);
      for (const i of index) {
        if (isNaN(i) || i <= 0 || i > Reply.pending.length)
          return api.sendMessage(getLang("invaildNumber", i), threadID, messageID);

        const targetThread = Reply.pending[i - 1].threadID;
        const threadInfo = await api.getThreadInfo(targetThread);
        const groupName = threadInfo.threadName || "Unnamed Group";
        const memberCount = threadInfo.participantIDs.length;
        const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

        api.sendMessage(
`╔═══✦〘 𝙶𝚁𝙾𝚄𝙿 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 〙✦═══╗
┃
┃ 🏷️ 𝙽𝚊𝚖𝚎: ${groupName}
┃ 🆔 𝙶𝚛𝚘𝚞𝚙 𝙸𝙳: ${targetThread}
┃ 👥 𝙼𝚎𝚖𝚋𝚎𝚛𝚜: ${memberCount}
┃ 🔒 𝙰𝚙𝚙𝚛𝚘𝚟𝚊𝚕 𝙼𝚘𝚍𝚎: ${threadInfo.approvalMode ? "On" : "Off"}
┃ 😊 𝙴𝚖𝚘𝚓𝚒: ${threadInfo.emoji || "None"}
┃ ⏰ 𝙹𝚘𝚒𝚗𝚎𝚍: ${time}
┃
╠══✦〘 𝙾𝚆𝙽𝙴𝚁 𝙸𝙽𝙵𝙾 〙✦══╣
┃ 🧑‍💻 𝙽𝚊𝚖𝚎: 『Ｓ Ａ Ｉ Ｍ』
┃ 🌐 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺: 𝐄𝐰'𝐫 𝐒𝐚𝐢𝐦
┃ 🗺️ 𝙲𝚘𝚞𝚗𝚝𝚛𝚢: Bangladesh
┃ ✅ 𝚂𝚝𝚊𝚝𝚞𝚜: Active
┃ 📞 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙: 01729537588
┃ ✉️ 𝙴𝚖𝚊𝚒𝚕: hrxnobita3@gmail.com
┃ 🧵 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖: https://t.me/saimx69x
┃ 💡 𝚃𝚒𝚙: Type /help to see all commands!
╚════════════════════╝`, targetThread);

        count++;
      }
      return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
  },

  onStart: async function ({ api, event, getLang, commandName }) {
    const { threadID, messageID } = event;
    let msg = "", index = 1;

    try {
      const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
      const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

      for (const item of list) msg += `${index++}/ ${item.name} (${item.threadID})\n`;

      if (list.length != 0) {
        return api.sendMessage(getLang("returnListPending", list.length, msg), threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
          });
        }, messageID);
      } else return api.sendMessage(getLang("returnListClean"), threadID, messageID);

    } catch (e) {
      return api.sendMessage(getLang("cantGetPendingList"), threadID, messageID);
    }
  }
=======
const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "approve",
    aliases: ["pen", "pend", "pe"],
    version: "1.6.9",
    author: "NeoKEX",
    countDown: 5,
    role: 0,
    shortDescription: "Handle pending requests",
    longDescription: "Approve or reject pending users or group requests",
    category: "utility",
  },

  onReply: async function ({ message, api, event, Reply }) {
    const { author, pending, messageID } = Reply;
    if (String(event.senderID) !== String(author)) return;

    const { body, threadID } = event;

    if (body.trim().toLowerCase() === "c") {
      try {
        await api.unsendMessage(messageID);
        return api.sendMessage(
          `Operation has been canceled!`,
          threadID
        );
      } catch {
        return;
      }
    }

    const indexes = body.split(/\s+/).map(Number);

    if (isNaN(indexes[0])) {
      return api.sendMessage(`× Invalid input! Please try again.`, threadID);
    }

    let count = 0;

    for (const idx of indexes) {
 
      if (idx <= 0 || idx > pending.length) continue;

      const group = pending[idx - 1];
      const prefix = global.GoatBot.config.prefix || "/";

      try {
        await api.sendMessage(
          `✓ Group approved! Type ${prefix}help to see available commands.`,
          group.threadID
        );

        await api.changeNickname(
          `${global.GoatBot.config.nickNameBot || "Bot"}`,
          group.threadID,
          api.getCurrentUserID()
        );

        count++;
      } catch {
        count++;
      }
    }

    for (const idx of indexes.sort((a, b) => b - a)) {
      if (idx > 0 && idx <= pending.length) {
        pending.splice(idx - 1, 1);
      }
    }

    return api.sendMessage(
      `✓ [ Successfully ] Approved ${count} Groups!`,
      threadID
    );
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID } = event;

    const type = args[0]?.toLowerCase();
    if (!type) {
      return api.sendMessage(
        `Usage: approve [user/thread/all]`,
        threadID
      );
    }

    let msg = "",
      index = 1;
    try {
      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const list = [...spam, ...pending];

      let filteredList = [];
      if (type.startsWith("u")) filteredList = list.filter((t) => !t.isGroup);
      if (type.startsWith("t")) filteredList = list.filter((t) => t.isGroup);
      if (type === "all") filteredList = list;

      for (const single of filteredList) {
        const name =
          single.name || (await usersData.getName(single.threadID)) || "Unknown";

        msg += `[ ${index} ]  ${name}\n`;
        index++;
      }

      msg += `✓ Reply with the correct group number to approve!\n`;
      msg += `× Reply with "c" to Cancel.\n`;

      return api.sendMessage(
        `[ Pending Groups & Users ${type
          .charAt(0)
          .toUpperCase()}${type.slice(1)} List ]\n\n${msg}`,
        threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            pending: filteredList,
          });
        },
        messageID
      );
    } catch (error) {
      return api.sendMessage(
        `× Failed to retrieve pending list. Please try again later.`,
        threadID
      );
    }
  },
>>>>>>> 9bbaa51 (update)
};