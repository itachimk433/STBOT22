const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
<<<<<<< HEAD
	config: {
		name: "uid",
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem user id facebook của người dùng",
			en: "View facebook user id of user"
		},
		category: "info",
		guide: {
			vi: "   {pn}: dùng để xem id facebook của bạn"
				+ "\n   {pn} @tag: xem id facebook của những người được tag"
				+ "\n   {pn} <link profile>: xem id facebook của link profile"
				+ "\n   Phản hồi tin nhắn của người khác kèm lệnh để xem id facebook của họ",
			en: "   {pn}: use to view your facebook user id"
				+ "\n   {pn} @tag: view facebook user id of tagged people"
				+ "\n   {pn} <profile link>: view facebook user id of profile link"
				+ "\n   Reply to someone's message with the command to view their facebook user id"
		}
	},

	langs: {
		vi: {
			syntaxError: "Vui lòng tag người muốn xem uid hoặc để trống để xem uid của bản thân"
		},
		en: {
			syntaxError: "Please tag the person you want to view uid or leave it blank to view your own uid"
		}
	},

	onStart: async function ({ message, event, args, getLang }) {
		if (event.messageReply)
			return message.reply(event.messageReply.senderID);
		if (!args[0])
			return message.reply(event.senderID);
		if (args[0].match(regExCheckURL)) {
			let msg = '';
			for (const link of args) {
				try {
					const uid = await findUid(link);
					msg += `${link} => ${uid}\n`;
				}
				catch (e) {
					msg += `${link} (ERROR) => ${e.message}\n`;
				}
			}
			message.reply(msg);
			return;
		}

		let msg = "";
		const { mentions } = event;
		for (const id in mentions)
			msg += `${mentions[id].replace("@", "")}: ${id}\n`;
		message.reply(msg || getLang("syntaxError"));
	}
};
=======
  config: {
    name: "uid",
    version: "1.4",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    description: {
      en: "View facebook user id of user"
    },
    category: "info",
    guide: {
      en:
        "『 UID Lookup 』\n"
      + "│\n"
      + "│ 🔹 {pn}\n"
      + "│     Your own UID\n"
      + "│\n"
      + "│ 🔹 {pn} @tag\n"
      + "│     UID of tagged person\n"
      + "│\n"
      + "│ 🔹 {pn} <profile link>\n"
      + "│     UID from Facebook profile URL\n"
      + "│     Example: {pn} https://www.facebook.com/CHARLESMKBANE\n"
      + "│\n"
      + "│ 🔹 {pn} (reply to a message)\n"
      + "│     UID of the person you replied to\n"
    }
  },

  langs: {
    en: {
      yourUID:
        "┌─『 Your UID 』\n"
      + "│ 🆔 %1\n"
      + "└────────────────────",
      replyUID:
        "┌─『 User UID 』\n"
      + "│ 🆔 %1\n"
      + "└────────────────────",
      linkResult:
        "┌─『 UID Lookup 』\n"
      + "%1"
      + "└────────────────────",
      linkSuccess: "│ ✅ %1\n│    ➜ %2\n",
      linkFailed:  "│ ❌ %1\n│    ➜ %2\n",
      tagResult:
        "┌─『 UID Lookup 』\n"
      + "%1"
      + "└────────────────────",
      tagLine: "│ 👤 %1: %2\n",
      syntaxError: "Please tag someone, reply to a message, or provide a profile link."
    }
  },

  onStart: async function ({ message, event, args, getLang }) {
    // Reply to a message
    if (event.messageReply)
      return message.reply(getLang("replyUID", event.messageReply.senderID));

    // No args — show own UID
    if (!args[0])
      return message.reply(getLang("yourUID", event.senderID));

    // Profile link(s)
    if (args[0].match(regExCheckURL)) {
      let lines = "";
      for (const link of args) {
        try {
          const uid = await findUid(link);
          lines += getLang("linkSuccess", link, uid);
        } catch (e) {
          lines += getLang("linkFailed", link, e.message);
        }
      }
      return message.reply(getLang("linkResult", lines));
    }

    // Tagged people
    const { mentions } = event;
    if (Object.keys(mentions).length > 0) {
      let lines = "";
      for (const id in mentions)
        lines += getLang("tagLine", mentions[id].replace("@", ""), id);
      return message.reply(getLang("tagResult", lines));
    }

    return message.reply(getLang("syntaxError"));
  }
};
>>>>>>> 9bbaa51 (update)
