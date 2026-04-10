<<<<<<< HEAD
const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "leave",
    aliases: ["leaves"],
    version: "2.0", 
    author: "Vex_Kshitiz",
    countDown: 5,
    role: 2,
    shortDescription: "Bot will leave a group chat",
    longDescription: "",
    category: "admin",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const groupList = await api.getThreadList(300, null, ['INBOX']); 

      const filteredList = groupList.filter(group => group.threadName !== null);

      if (filteredList.length === 0) {
        api.sendMessage('No group chats found.', event.threadID);
      } else {
        const formattedList = filteredList.map((group, index) =>
          `│${index + 1}. ${group.threadName}\n│𝐓𝐈𝐃: ${group.threadID}`
        );

       
        const start = 0;
        const currentList = formattedList.slice(start, start + 5);

        const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${currentList.join("\n")}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: 'leave',
          messageID: sentMessage.messageID,
          author: event.senderID,
          start,
        });
      }
    } catch (error) {
      console.error("Error listing group chats", error);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, start } = Reply;

    if (event.senderID !== author) {
      return;
    }

    const userInput = args.join(" ").trim().toLowerCase();

    if (userInput === 'next') {
  
      const nextPageStart = start + 5;
      const nextPageEnd = nextPageStart + 5;

      try {
        const groupList = await api.getThreadList(300, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (nextPageStart >= filteredList.length) {
          api.sendMessage('End of list reached.', event.threadID, event.messageID);
          return;
        }

        const currentList = filteredList.slice(nextPageStart, nextPageEnd).map((group, index) =>
          `${nextPageStart + index + 1}. ${group.threadName}\n𝐓𝐈𝐃: ${group.threadID}`
        );

        const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${currentList.join("\n")}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: 'leave',
          messageID: sentMessage.messageID,
          author: event.senderID,
          start: nextPageStart,
        });

      } catch (error) {
        console.error("Error listing group chats", error);
        api.sendMessage('An error occurred while listing group chats.', event.threadID, event.messageID);
      }

    } else if (userInput === 'previous') {
  
      const prevPageStart = Math.max(start - 5, 0);
      const prevPageEnd = prevPageStart + 5;

      try {
        const groupList = await api.getThreadList(300, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (prevPageStart < 0) {
          api.sendMessage('Already at the beginning of the list.', event.threadID, event.messageID);
          return;
        }

        const currentList = filteredList.slice(prevPageStart, prevPageEnd).map((group, index) =>
          `${prevPageStart + index + 1}. ${group.threadName}\n𝐓𝐈𝐃: ${group.threadID}`
        );

        const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${currentList.join("\n")}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: 'leave',
          messageID: sentMessage.messageID,
          author: event.senderID,
          start: prevPageStart,
        });

      } catch (error) {
        console.error("Error listing group chats", error);
        api.sendMessage('An error occurred while listing group chats.', event.threadID, event.messageID);
      }

    } else if (!isNaN(userInput)) {
  
      const groupIndex = parseInt(userInput, 10);

      try {
        const groupList = await api.getThreadList(300, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (groupIndex <= 0 || groupIndex > filteredList.length) {
          api.sendMessage('Invalid group number.\nPlease choose a number within the range.', event.threadID, event.messageID);
          return;
        }

        const selectedGroup = filteredList[groupIndex - 1];
        const groupID = selectedGroup.threadID;

        const botUserId = api.getCurrentUserID();
        await api.removeUserFromGroup(botUserId, groupID);

        api.sendMessage(`Left the group chat: ${selectedGroup.threadName}`, event.threadID, event.messageID);

      } catch (error) {
        console.error("Error leaving group chat", error);
        api.sendMessage('An error occurred while leaving the group chat.\nPlease try again later.', event.threadID, event.messageID);
      }

    } else {
      api.sendMessage('Invalid input.\nPlease provide a valid number or reply with "next" or "previous".', event.threadID, event.messageID);
    }

   
    global.GoatBot.onReply.delete(event.messageID);
  },
=======
module.exports = {
  config: {
    name: "leave",
    version: "1.1",
    author: "ArYAN",
    countDown: 10,
    role: 1,
    shortDescription: {
      en: "List groups & leave selected"
    },
    longDescription: {
      en: "Shows groups where bot is a member (8 per page). On reply with number, bot sends a goodbye message in that group then leaves."
    },
    category: "owner",
    guide: {
      en: "{p}leave → list groups\nReply with number → bot leaves group\nReply 'next'/'prev' → paginate"
    }
  },

  onStart: async function ({ api, message, threadsData, event }) {
    const allThreads = await threadsData.getAll();
    const groups = allThreads.filter(t => t.isGroup);

    if (groups.length === 0) return message.reply("❌ No groups found.");

    const page = 1;
    const perPage = 8;
    const totalPages = Math.ceil(groups.length / perPage);

    const msg = await this.renderPage(api, groups, page, perPage, totalPages);

    return message.reply(msg, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        groups,
        page,
        perPage,
        totalPages
      });
    });
  },

  onReply: async function ({ api, message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const body = event.body.trim().toLowerCase();

    if (body === "next" || body === "prev") {
      let newPage = Reply.page;
      if (body === "next" && Reply.page < Reply.totalPages) newPage++;
      else if (body === "prev" && Reply.page > 1) newPage--;

      const msg = await this.renderPage(api, Reply.groups, newPage, Reply.perPage, Reply.totalPages);
      return message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          ...Reply,
          page: newPage
        });
      });
    }

    const choice = parseInt(body);
    if (isNaN(choice)) return message.reply("❌ Invalid input. Reply with number, 'next', or 'prev'.");

    const index = (Reply.page - 1) * Reply.perPage + (choice - 1);
    if (index < 0 || index >= Reply.groups.length) return message.reply("❌ Invalid choice.");

    const selectedGroup = Reply.groups[index];
    const threadID = selectedGroup.threadID;

    try {
      const info = await api.getThreadInfo(threadID);
      const memberCount = info.participantIDs.length;

      const goodbyeBox =
        `┌──────────────┐\n` +
        `│ 👋 𝗕𝗼𝘁 𝗟𝗲𝗮𝘃𝗶𝗻𝗴\n` +
        `├──────────────┤\n` +
        `│ 📌 Group : ${info.threadName || "Unnamed"}\n` +
        `│ 🆔 ID    : ${threadID}\n` +
        `│ 👥 Members: ${memberCount}\n` +
        `└──────────────┘\n` +
        `🙏 Thank you!`;

      await api.sendMessage(goodbyeBox, threadID);
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID);

      return message.reply(`✅ Bot left the group: ${info.threadName || "Unnamed"} (${threadID})`);

    } catch (err) {
      return message.reply(`❌ Error leaving group: ${err.message}`);
    }
  },

  renderPage: async function (api, groups, page, perPage, totalPages) {
    let msg = `📦 Groups where bot is a member (Page ${page}/${totalPages}):\n\n`;
    const start = (page - 1) * perPage;
    const end = Math.min(start + perPage, groups.length);

    for (let i = start; i < end; i++) {
      const g = groups[i];
      try {
        const info = await api.getThreadInfo(g.threadID);
        const approval = info.approvalMode ? "✅ Approved On" : "❌ Approved Off";
        const memberCount = info.participantIDs.length;

        msg += `${i - start + 1}. ${g.threadName || "Unnamed"}\n🆔 ${g.threadID}\n👥 Members: ${memberCount}\n🔐 ${approval}\n\n`;
      } catch {
        msg += `${i - start + 1}. ${g.threadName || "Unnamed"}\n🆔 ${g.threadID}\n⚠️ Failed to fetch info\n\n`;
      }
    }

    msg += `👉 Reply with number to make bot leave.\n`;
    if (page < totalPages) msg += `➡️ Reply "next" for next page.\n`;
    if (page > 1) msg += `⬅️ Reply "prev" for previous page.\n`;

    return msg;
  }
>>>>>>> 9bbaa51 (update)
};
