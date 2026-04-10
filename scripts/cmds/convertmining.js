// ── Resource definitions — synced exactly from mine.js ──────────────────────
const RESOURCES = {
  // Ultra Rare
  rhodium:   { name: "Rhodium",   emoji: "⚪", unit: "g",  rarity: "ultra",    valuePerGram: 15000 },
  platinum:  { name: "Platinum",  emoji: "⚪", unit: "g",  rarity: "ultra",    valuePerGram: 12000 },
  gold:      { name: "Gold",      emoji: "🥇", unit: "g",  rarity: "ultra",    valuePerGram: 10000 },
  diamond:   { name: "Diamond",   emoji: "💎", unit: "ct", rarity: "ultra",    valuePerGram: 50000 },
  emerald:   { name: "Emerald",   emoji: "💚", unit: "ct", rarity: "ultra",    valuePerGram: 40000 },
  ruby:      { name: "Ruby",      emoji: "❤️", unit: "ct", rarity: "ultra",    valuePerGram: 35000 },
  // Rare
  palladium: { name: "Palladium", emoji: "⚪", unit: "g",  rarity: "rare",     valuePerGram: 8000  },
  iridium:   { name: "Iridium",   emoji: "⚪", unit: "g",  rarity: "rare",     valuePerGram: 7000  },
  osmium:    { name: "Osmium",    emoji: "🔵", unit: "g",  rarity: "rare",     valuePerGram: 6000  },
  sapphire:  { name: "Sapphire",  emoji: "💙", unit: "ct", rarity: "rare",     valuePerGram: 30000 },
  // Uncommon
  rhenium:   { name: "Rhenium",   emoji: "⚪", unit: "g",  rarity: "uncommon", valuePerGram: 5000  },
  ruthenium: { name: "Ruthenium", emoji: "⚪", unit: "g",  rarity: "uncommon", valuePerGram: 4500  },
  silver:    { name: "Silver",    emoji: "⚪", unit: "g",  rarity: "uncommon", valuePerGram: 1000  },
  // Common
  lithium:   { name: "Lithium",   emoji: "⚪", unit: "kg", rarity: "common",   valuePerGram: 150   },
  cobalt:    { name: "Cobalt",    emoji: "🔵", unit: "kg", rarity: "common",   valuePerGram: 120   },
  titanium:  { name: "Titanium",  emoji: "⚪", unit: "kg", rarity: "common",   valuePerGram: 100   },
  tungsten:  { name: "Tungsten",  emoji: "⚫", unit: "kg", rarity: "common",   valuePerGram: 90    },
  copper:    { name: "Copper",    emoji: "🟤", unit: "kg", rarity: "common",   valuePerGram: 80    },
  nickel:    { name: "Nickel",    emoji: "⚪", unit: "kg", rarity: "common",   valuePerGram: 75    },
};
// ─────────────────────────────────────────────────────────────────────────────

// Tracks users who have opened the convert menu and are awaiting a reply
const pendingConvert = new Map();

module.exports = {
  config: {
    name: "convertmining",
    aliases: ["sellore", "sellmining", "convertore"],
    version: "1.1",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: "Convert mined resources to wallet money",
    category: "economy",
    guide: {
      en:
        "『 Convert Mining Resources 』\n"
      + "│\n"
      + "│ 🔹 {pn}\n"
      + "│     Shows your mined inventory with list numbers\n"
      + "│     Reply with a number to convert that resource\n"
      + "│     Reply with 'all' to convert everything at once\n"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const { senderID } = event;
    const userData     = await usersData.get(senderID);
    const miningData   = userData.data?.mining;

    if (!miningData || !miningData.resources || Object.keys(miningData.resources).length === 0)
      return message.reply(
        "📦 𝗘𝗠𝗣𝗧𝗬 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬\n"
      + "━━━━━━━━━━━━━━━━━━\n"
      + "You have no mined resources to convert.\n"
      + "Use +mine to start mining!"
      );

    // Build the convertible items list
    const items = [];
    for (const [id, amount] of Object.entries(miningData.resources)) {
      if (amount > 0 && RESOURCES[id]) {
        const r = RESOURCES[id];
        items.push({
          id,
          name:   r.name,
          emoji:  r.emoji,
          unit:   r.unit,
          rarity: r.rarity,
          amount,
          value:  Math.floor(amount * r.valuePerGram)
        });
      }
    }

    if (items.length === 0)
      return message.reply("📦 You have no resources to convert.");

    // Sort by value descending
    items.sort((a, b) => b.value - a.value);

    const rarityEmojis = { ultra: "🌟", rare: "⭐", uncommon: "✨", common: "📦" };
    let listText = "";
    let grandTotal = 0;

    items.forEach((item, i) => {
      grandTotal += item.value;
      listText +=
        `${i + 1}. ${rarityEmojis[item.rarity]} ${item.emoji} ${item.name}\n`
      + `    ${item.amount.toFixed(2)}${item.unit} → $${item.value.toLocaleString()}\n\n`;
    });

    // Gold stones if any
    const goldStones = miningData.goldStones || 0;
    const goldStoneValue = goldStones * 500000;
    if (goldStones > 0) {
      grandTotal += goldStoneValue;
      listText +=
        `${items.length + 1}. 🏆 Gold Stones\n`
      + `    ${goldStones}x → $${goldStoneValue.toLocaleString()}\n\n`;
    }

    // Clear any existing pending state
    const existing = pendingConvert.get(senderID);
    if (existing) { clearTimeout(existing.timeout); pendingConvert.delete(senderID); }

    const handle = setTimeout(() => pendingConvert.delete(senderID), 60_000);
    pendingConvert.set(senderID, { items, hasGoldStones: goldStones > 0, goldStones, timeout: handle });

    return message.reply(
      `💱 𝗖𝗢𝗡𝗩𝗘𝗥𝗧 𝗥𝗘𝗦𝗢𝗨𝗥𝗖𝗘𝗦\n`
    + `━━━━━━━━━━━━━━━━━━\n\n`
    + listText
    + `━━━━━━━━━━━━━━━━━━\n`
    + `💰 Grand Total: $${grandTotal.toLocaleString()}\n\n`
    + `❓ Reply with a number to convert that resource\n`
    + `   or reply 'all' to convert everything.\n`
    + `   Expires in 60 seconds.`
    );
  },

  onChat: async function ({ event, message, usersData }) {
    const { senderID } = event;
    const input = event.body?.trim().toLowerCase();
    const state = pendingConvert.get(senderID);
    if (!state) return;

    clearTimeout(state.timeout);
    pendingConvert.delete(senderID);

    const userData   = await usersData.get(senderID);
    const miningData = userData.data?.mining;
    if (!miningData) return message.reply("❌ Mining data not found.");

    // ── Convert ALL ─────────────────────────────────────────────────
    if (input === "all") {
      let totalConverted = 0;
      const converted = [];

      for (const item of state.items) {
        if ((miningData.resources[item.id] || 0) > 0) {
          const value = Math.floor(miningData.resources[item.id] * RESOURCES[item.id].valuePerGram);
          totalConverted += value;
          converted.push(`${item.emoji} ${item.name}: +$${value.toLocaleString()}`);
          miningData.resources[item.id] = 0;
        }
      }

      // Gold stones too
      if (state.hasGoldStones && miningData.goldStones > 0) {
        const gsValue = miningData.goldStones * 500000;
        totalConverted += gsValue;
        converted.push(`🏆 Gold Stones (${miningData.goldStones}x): +$${gsValue.toLocaleString()}`);
        miningData.goldStones = 0;
      }

      if (totalConverted === 0)
        return message.reply("❌ Nothing to convert.");

      userData.money = (userData.money || 0) + totalConverted;
      userData.data.mining = miningData;
      await usersData.set(senderID, { ...userData, money: userData.money, data: userData.data });

      return message.reply(
        `✅ 𝗔𝗟𝗟 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗗!\n`
      + `━━━━━━━━━━━━━━━━━━\n\n`
      + converted.join("\n") + "\n\n"
      + `━━━━━━━━━━━━━━━━━━\n`
      + `💰 Total Added: $${totalConverted.toLocaleString()}\n`
      + `👛 Wallet: $${userData.money.toLocaleString()}`
      );
    }

    // ── Convert single item ─────────────────────────────────────────
    const choice = parseInt(input);
    const totalItems = state.items.length + (state.hasGoldStones ? 1 : 0);

    if (isNaN(choice) || choice < 1 || choice > totalItems) {
      return message.reply(
        `❌ Invalid choice. Please reply with a number between 1 and ${totalItems}, or 'all'.`
      );
    }

    // Gold stone selected
    if (state.hasGoldStones && choice === state.items.length + 1) {
      if (!miningData.goldStones || miningData.goldStones === 0)
        return message.reply("❌ You have no Gold Stones.");

      const value = miningData.goldStones * 500000;
      userData.money = (userData.money || 0) + value;
      const count = miningData.goldStones;
      miningData.goldStones = 0;
      userData.data.mining = miningData;
      await usersData.set(senderID, { ...userData, money: userData.money, data: userData.data });

      return message.reply(
        `✅ 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗗!\n`
      + `━━━━━━━━━━━━━━━━━━\n\n`
      + `🏆 Gold Stones (${count}x)\n`
      + `💰 Added: $${value.toLocaleString()}\n\n`
      + `━━━━━━━━━━━━━━━━━━\n`
      + `👛 Wallet: $${userData.money.toLocaleString()}`
      );
    }

    // Regular resource selected
    const item = state.items[choice - 1];
    const currentAmount = miningData.resources[item.id] || 0;

    if (currentAmount <= 0)
      return message.reply(`❌ You have no ${item.name} left to convert.`);

    const value = Math.floor(currentAmount * RESOURCES[item.id].valuePerGram);
    userData.money = (userData.money || 0) + value;
    miningData.resources[item.id] = 0;
    userData.data.mining = miningData;
    await usersData.set(senderID, { ...userData, money: userData.money, data: userData.data });

    return message.reply(
      `✅ 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗗!\n`
    + `━━━━━━━━━━━━━━━━━━\n\n`
    + `${item.emoji} ${item.name}\n`
    + `📦 Amount: ${currentAmount.toFixed(2)}${item.unit}\n`
    + `💰 Added: $${value.toLocaleString()}\n\n`
    + `━━━━━━━━━━━━━━━━━━\n`
    + `👛 Wallet: $${userData.money.toLocaleString()}`
    );
  }
};
