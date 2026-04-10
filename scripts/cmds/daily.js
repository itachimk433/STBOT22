<<<<<<< HEAD
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "daily",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Nhận quà hàng ngày",
			en: "Receive daily gift"
		},
		category: "game",
		guide: {
			vi: "   {pn}: Nhận quà hàng ngày"
				+ "\n   {pn} info: Xem thông tin quà hàng ngày",
			en: "   {pn}"
				+ "\n   {pn} info: View daily gift information"
		},
		envConfig: {
			rewardFirstDay: {
				coin: 100,
				exp: 10
			}
		}
	},

	langs: {
		vi: {
			monday: "Thứ 2",
			tuesday: "Thứ 3",
			wednesday: "Thứ 4",
			thursday: "Thứ 5",
			friday: "Thứ 6",
			saturday: "Thứ 7",
			sunday: "Chủ nhật",
			alreadyReceived: "Bạn đã nhận quà rồi",
			received: "Bạn đã nhận được %1 coin và %2 exp"
		},
		en: {
			monday: "Monday",
			tuesday: "Tuesday",
			wednesday: "Wednesday",
			thursday: "Thursday",
			friday: "Friday",
			saturday: "Saturday",
			sunday: "Sunday",
			alreadyReceived: "You have already received the gift",
			received: "You have received %1 coin and %2 exp"
		}
	},

	onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
		const reward = envCommands[commandName].rewardFirstDay;
		if (args[0] == "info") {
			let msg = "";
			for (let i = 1; i < 8; i++) {
				const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
				const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
				const day = i == 7 ? getLang("sunday") :
					i == 6 ? getLang("saturday") :
						i == 5 ? getLang("friday") :
							i == 4 ? getLang("thursday") :
								i == 3 ? getLang("wednesday") :
									i == 2 ? getLang("tuesday") :
										getLang("monday");
				msg += `${day}: ${getCoin} coin, ${getExp} exp\n`;
			}
			return message.reply(msg);
		}

		const dateTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
		const date = new Date();
		const currentDay = date.getDay(); // 0: sunday, 1: monday, 2: tuesday, 3: wednesday, 4: thursday, 5: friday, 6: saturday
		const { senderID } = event;

		const userData = await usersData.get(senderID);
		if (userData.data.lastTimeGetReward === dateTime)
			return message.reply(getLang("alreadyReceived"));

		const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((currentDay == 0 ? 7 : currentDay) - 1));
		const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((currentDay == 0 ? 7 : currentDay) - 1));
		userData.data.lastTimeGetReward = dateTime;
		await usersData.set(senderID, {
			money: userData.money + getCoin,
			exp: userData.exp + getExp,
			data: userData.data
		});
		message.reply(getLang("received", getCoin, getExp));
	}
};
=======
module.exports = {
  config: {
    name: "daily",
    aliases: ["dailyclaim"],
    version: "1.1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: "Claim daily rewards",
    category: "economy",
    guide: {
      en: "{pn} - Claim daily money reward"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const { senderID } = event;
    const user = await usersData.get(senderID);

    if (!user.data) user.data = {};
    if (!user.data.daily) {
      user.data.daily = { lastClaim: 0, streak: 0 };
    }

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const timeSinceLastClaim = now - user.data.daily.lastClaim;

    if (timeSinceLastClaim < dayMs) {
      const timeLeft = dayMs - timeSinceLastClaim;
      const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
      const minsLeft  = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      return message.reply(
        `⏰ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗖𝗟𝗔𝗜𝗠𝗘𝗗\n\n` +
        `You already claimed your daily reward!\n` +
        `Come back in: ${hoursLeft}h ${minsLeft}m`
      );
    }

    // Update streak
    if (timeSinceLastClaim < 2 * dayMs) {
      user.data.daily.streak += 1;
    } else {
      user.data.daily.streak = 1;
    }

    const streak      = user.data.daily.streak;
    const baseReward  = 2000;
    const streakBonus = Math.min(streak * 500, 10000);
    const totalReward = baseReward + streakBonus;

    user.money = (user.money || 0) + totalReward;
    user.data.daily.lastClaim = now;

    await usersData.set(senderID, user);

    return message.reply(
      `🎁 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𝗖𝗟𝗔𝗜𝗠𝗘𝗗!\n\n` +
      `💰 Reward: $${totalReward.toLocaleString()}\n` +
      `🔥 Streak: ${streak} day${streak > 1 ? "s" : ""}\n` +
      `🎯 Streak Bonus: $${streakBonus.toLocaleString()}`
    );
  }
};
>>>>>>> 9bbaa51 (update)
