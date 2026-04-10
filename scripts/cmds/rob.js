module.exports = {
  config: {
    name: "rob",
    aliases: ["steal"],
    version: "2.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: "Attempt to rob another user's wallet",
    category: "economy",
    guide: {
      en:
        "『 Rob 』\n"
      + "│\n"
      + "│ 🔹 {pn} @mention / reply / <uid>\n"
      + "│     50% chance to steal 15–35% of their wallet\n"
      + "│\n"
      + "│ ⚠️ If you FAIL:\n"
      + "│     Police fine you 90% of your wallet\n"
      + "│     + 30% of your bank balance\n"
    }
  },

  onStart: async function ({ message, event, args, usersData, api }) {
    const { senderID, messageReply } = event;

    // ── Resolve target ──────────────────────────────────────────────
    let targetID;

    if (messageReply) {
      targetID = messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } else if (args[0] && /^\d+$/.test(args[0].replace(/[^0-9]/g, ''))) {
      targetID = args[0].replace(/[^0-9]/g, '');
    } else {
      return message.reply(
        "❌ Please mention a user, reply to their message, or provide their UID!"
      );
    }

    if (!targetID)
      return message.reply("❌ Invalid user ID!");

    if (targetID === senderID)
      return message.reply("🤡 You can't rob yourself, genius!");

    // ── Fetch data ──────────────────────────────────────────────────
    const robber = await usersData.get(senderID);
    const victim = await usersData.get(targetID);

    if (!robber.data) robber.data = {};
    if (!victim.data) victim.data = {};

    const victimMoney = victim.money || 0;
    if (victimMoney < 100)
      return message.reply("💸 This user is broke! Not worth robbing.");

    // ── Fetch names ─────────────────────────────────────────────────
    let robberName = "You";
    let victimName = "User";
    try {
      const userInfo = await api.getUserInfo([senderID, targetID]);
      robberName = userInfo[senderID]?.name || "You";
      victimName = userInfo[targetID]?.name || "User";
    } catch {}

    // ── 50/50 roll ──────────────────────────────────────────────────
    const success = Math.random() < 0.5;

    // ── FAILED: police fine ─────────────────────────────────────────
    if (!success) {
      const walletFine = Math.floor((robber.money || 0) * 0.90);
      const bankFine   = Math.floor((robber.data.bankBalance || 0) * 0.30);

      robber.money = Math.max(0, (robber.money || 0) - walletFine);
      if (robber.data.bankBalance)
        robber.data.bankBalance = Math.max(0, robber.data.bankBalance - bankFine);

      await usersData.set(senderID, { ...robber, data: { ...robber.data } });

      let fineMsg =
        `🚔 𝗖𝗔𝗨𝗚𝗛𝗧 𝗕𝗬 𝗣𝗢𝗟𝗜𝗖𝗘!\n`
      + `━━━━━━━━━━━━━━━━━━━━━━\n`
      + `😂 You tried to rob ${victimName} and got caught!\n\n`
      + `💸 Wallet fine:  -$${walletFine.toLocaleString()} (90%)\n`;

      if (bankFine > 0)
        fineMsg += `🏦 Bank fine:    -$${bankFine.toLocaleString()} (30%)\n`;

      fineMsg +=
        `━━━━━━━━━━━━━━━━━━━━━━\n`
      + `💡 Maybe stick to honest work next time.`;

      return message.reply(fineMsg);
    }

    // ── SUCCESS: steal 15–35% of victim's wallet ────────────────────
    const randomPercent  = Math.floor(Math.random() * 21) + 15; // 15–35
    const stolenAmount   = Math.floor((victimMoney * randomPercent) / 100);

    robber.money  = (robber.money || 0) + stolenAmount;
    victim.money  = victimMoney - stolenAmount;

    await usersData.set(senderID, { ...robber, data: { ...robber.data } });
    await usersData.set(targetID, { ...victim, data: { ...victim.data } });

    message.reply(
      `✅ 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦! 💰\n`
    + `━━━━━━━━━━━━━━━━━━━━━━\n`
    + `You swiped $${stolenAmount.toLocaleString()} from ${victimName}!\n`
    + `(${randomPercent}% of their wallet)\n`
    + `━━━━━━━━━━━━━━━━━━━━━━\n`
    + `💰 Your wallet: $${robber.money.toLocaleString()}`
    );

    api.sendMessage(
      `🚨 𝗬𝗢𝗨'𝗩𝗘 𝗕𝗘𝗘𝗡 𝗥𝗢𝗕𝗕𝗘𝗗!\n`
    + `━━━━━━━━━━━━━━━━━━━━━━\n`
    + `${robberName} just stole $${stolenAmount.toLocaleString()} from your wallet!\n\n`
    + `💡 Keep your money safe:\n`
    + `   +bank deposit <amount>`,
      targetID
    );
  }
};
