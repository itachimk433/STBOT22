<<<<<<< HEAD
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
=======
const slotUsage = new Map();
>>>>>>> 9bbaa51 (update)

module.exports = {
  config: {
    name: "slot",
<<<<<<< HEAD
    aliases: [],
    version: "2.4.78",
    author: "ST | Sheikh Tamim",
    countDown: 10,
    role: 0,
    premium: false,
    usePrefix: true,
    description: "Play hexagonal slot machine with beautiful animations!",
    category: "game",
    guide: "{pn} <bet amount> - Spin the hexagonal slots!"
  },

  langs: {
    en: {
      noBet: "❌ Please provide a bet amount!\nUsage: {pn} <amount>",
      invalidBet: "❌ Invalid bet amount! Please enter a valid number.",
      notEnoughMoney: "❌ You don't have enough money!\n💰 Your balance: ${balance}\n💸 Bet amount: ${bet}",
      processing: "🎰 Spinning hexagonal slots... Please wait!"
    }
  },

  ST: async function({ message, args, event, usersData, getLang, commandName, api }) {
    const { senderID, threadID } = event;

    if (!args[0]) {
      return message.reply(getLang("noBet").replace("{pn}", commandName));
    }

    const betAmount = parseInt(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply(getLang("invalidBet"));
    }

    const userData = await usersData.get(senderID);
    const userName = userData.name || "Player";
    const userMoney = userData.money || 0;

    if (userMoney < betAmount) {
      return message.reply(getLang("notEnoughMoney")
        .replace("{balance}", userMoney)
        .replace("{bet}", betAmount));
    }

    await message.reply(getLang("processing"));

    const symbols = {
      'SEVEN': { emoji: '7️⃣', color: '#FF0000', payout: 200 },
      'DIAMOND': { emoji: '💎', color: '#00D4FF', payout: 100 },
      'BELL': { emoji: '🔔', color: '#FFD700', payout: 50 },
      'STAR': { emoji: '⭐', color: '#FFA500', payout: 30 },
      'MELON': { emoji: '🍉', color: '#2ECC71', payout: 20 },
      'ORANGE': { emoji: '🍊', color: '#FF8C42', payout: 15 },
      'GRAPE': { emoji: '🍇', color: '#9B59B6', payout: 10 },
      'LEMON': { emoji: '🍋', color: '#FFD93D', payout: 8 },
      'CHERRY': { emoji: '🍒', color: '#FF6B6B', payout: 5 }
    };

    const symbolKeys = Object.keys(symbols);
    
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(symbolKeys[Math.floor(Math.random() * symbolKeys.length)]);
    }

    let winMultiplier = 0;
    let winMessage = '';

    if (result[0] === result[1] && result[1] === result[2]) {
      winMultiplier = symbols[result[0]].payout;
      winMessage = `${symbols[result[0]].emoji}${symbols[result[1]].emoji}${symbols[result[2]].emoji}`;
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      winMultiplier = 2;
    }

    const tempDir = path.join(__dirname, 'temp');
    await fs.ensureDir(tempDir);
    const gifPath = path.join(tempDir, `hexslot_${senderID}_${Date.now()}.gif`);

    const width = 1100;
    const height = 1200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    function drawHexagon(x, y, size, fillGradient, strokeColor, lineWidth, glow = false, glowColor = '#FFD700') {
      if (glow) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 30;
      }
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      
      if (fillGradient) {
        ctx.fillStyle = fillGradient;
        ctx.fill();
      }
      
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
    }

    const encoder = new GIFEncoder(width, height);
    const stream = encoder.createReadStream().pipe(fs.createWriteStream(gifPath));

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(80);
      encoder.setQuality(15);

      const totalFrames = 50;
      const spinFrames = 38;

      let winAmount = 0;
      if (winMultiplier > 0) {
        winAmount = betAmount * winMultiplier;
      }
      const newBalance = userMoney - betAmount + winAmount;

      const slotPositions = [
        { x: width / 2 - 220, y: 450 },
        { x: width / 2, y: 450 },
        { x: width / 2 + 220, y: 450 }
      ];

      for (let frame = 0; frame < totalFrames; frame++) {
        const animProgress = frame / totalFrames;
        
        const bgTime = frame * 0.02;
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, `hsl(${(bgTime * 50) % 360}, 40%, 10%)`);
        bgGradient.addColorStop(0.5, `hsl(${(bgTime * 50 + 60) % 360}, 50%, 15%)`);
        bgGradient.addColorStop(1, `hsl(${(bgTime * 50 + 120) % 360}, 40%, 10%)`);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 20; i++) {
          const starX = (width / 20) * i + (frame * 2) % (width / 20);
          const starY = (i * 73) % height;
          const starSize = 2 + (i % 3);
          const starOpacity = 0.3 + Math.sin(frame * 0.1 + i) * 0.2;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
          ctx.beginPath();
          ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
          ctx.fill();
        }

        const headerGradient = ctx.createLinearGradient(0, 0, width, 180);
        headerGradient.addColorStop(0, '#6a11cb');
        headerGradient.addColorStop(0.5, '#2575fc');
        headerGradient.addColorStop(1, '#ff6a00');
        ctx.fillStyle = headerGradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 25;
        ctx.fillRect(0, 0, width, 180);
        ctx.shadowBlur = 0;

        const titlePulse = 1 + Math.sin(frame * 0.15) * 0.03;
        ctx.save();
        ctx.translate(width / 2, 70);
        ctx.scale(titlePulse, titlePulse);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText('🎰 SLOT MACHINE 🎰', 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Player: ${userName}`, width / 2, 140);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`Bet: $${betAmount}`, width / 2, 240);

        for (let i = 0; i < 3; i++) {
          const pos = slotPositions[i];
          const stopFrame = spinFrames - (i * 8);

          let displaySymbol;
          if (frame < stopFrame) {
            const spinSpeed = Math.floor(frame * 3) % symbolKeys.length;
            displaySymbol = symbolKeys[spinSpeed];
          } else {
            displaySymbol = result[i];
          }

          const hexSize = 130;
          let scale = 1;
          let rotation = 0;

          if (frame < stopFrame) {
            scale = 0.92 + Math.sin(frame * 0.8) * 0.08;
            rotation = (frame * 0.3) % (Math.PI * 2);
          } else if (frame >= stopFrame && frame < stopFrame + 8) {
            const bounceProgress = (frame - stopFrame) / 8;
            scale = 1 + Math.sin(bounceProgress * Math.PI) * 0.25;
          } else {
            scale = 1;
          }

          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);

          const hexGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, hexSize);
          hexGradient.addColorStop(0, symbols[displaySymbol].color + 'CC');
          hexGradient.addColorStop(0.5, symbols[displaySymbol].color + '66');
          hexGradient.addColorStop(1, symbols[displaySymbol].color + '22');

          const isLocked = frame >= stopFrame;
          drawHexagon(0, 0, hexSize, hexGradient, 
            isLocked ? '#FFD700' : '#4a5568',
            isLocked ? 8 : 5,
            isLocked,
            symbols[displaySymbol].color);

          ctx.font = 'bold 100px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = symbols[displaySymbol].color;
          ctx.shadowBlur = isLocked ? 25 : 10;
          ctx.fillText(symbols[displaySymbol].emoji, 0, 0);
          ctx.shadowBlur = 0;

          if (isLocked) {
            ctx.font = 'bold 22px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.fillText(displaySymbol, 0, hexSize + 35);
          }

          ctx.restore();
        }

        if (frame >= spinFrames + 5) {
          const resultY = 720;

          if (winMultiplier > 0) {
            if (winMultiplier >= 100) {
              const megaPulse = 1 + Math.sin((frame - spinFrames) * 0.4) * 0.15;
              
              for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2 + frame * 0.2;
                const radius = 200 + Math.sin(frame * 0.3 + i) * 30;
                const starX = width / 2 + Math.cos(angle) * radius;
                const starY = resultY + Math.sin(angle) * radius;
                
                ctx.fillStyle = `rgba(255, 215, 0, ${0.6 + Math.sin(frame * 0.5 + i) * 0.4})`;
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⭐', starX, starY);
              }

              ctx.save();
              ctx.translate(width / 2, resultY - 50);
              ctx.scale(megaPulse, megaPulse);
              
              const jackpotGradient = ctx.createLinearGradient(-200, 0, 200, 0);
              jackpotGradient.addColorStop(0, '#FFD700');
              jackpotGradient.addColorStop(0.5, '#FFA500');
              jackpotGradient.addColorStop(1, '#FFD700');
              ctx.fillStyle = jackpotGradient;
              ctx.font = 'bold 80px Arial';
              ctx.textAlign = 'center';
              ctx.shadowColor = '#FFD700';
              ctx.shadowBlur = 40;
              ctx.fillText('💎 JACKPOT 💎', 0, 0);
              ctx.shadowBlur = 0;
              ctx.restore();

              ctx.fillStyle = '#FFFFFF';
              ctx.font = 'bold 56px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(winMessage, width / 2, resultY + 30);

              ctx.fillStyle = '#FFD700';
              ctx.font = 'bold 64px Arial';
              ctx.fillText(`WIN: $${winAmount}`, width / 2, resultY + 100);
            } else {
              ctx.fillStyle = '#2ECC71';
              ctx.font = 'bold 52px Arial';
              ctx.textAlign = 'center';
              ctx.shadowColor = '#2ECC71';
              ctx.shadowBlur = 20;
              ctx.fillText('🎉 WINNER! 🎉', width / 2, resultY);
              ctx.shadowBlur = 0;

              if (winMessage) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 50px Arial';
                ctx.fillText(winMessage, width / 2, resultY + 60);
              }

              ctx.fillStyle = '#FFD700';
              ctx.font = 'bold 56px Arial';
              ctx.fillText(`WIN: $${winAmount}`, width / 2, resultY + 130);
            }

            ctx.fillStyle = '#4ecca3';
            ctx.font = 'bold 46px Arial';
            ctx.fillText(`Balance: $${newBalance}`, width / 2, resultY + 200);
          } else {
            ctx.fillStyle = '#E74C3C';
            ctx.font = 'bold 56px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#E74C3C';
            ctx.shadowBlur = 20;
            ctx.fillText('😢 NO WIN', width / 2, resultY);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#95a5a6';
            ctx.font = 'bold 44px Arial';
            ctx.fillText(`Balance: $${newBalance}`, width / 2, resultY + 80);
          }

          ctx.fillStyle = '#ecf0f1';
          ctx.font = 'bold 36px Arial';
          ctx.fillText('Good Luck Next Time!', width / 2, height - 80);
        }

        encoder.addFrame(ctx);
      }

      encoder.finish();
    });

    let winAmount = 0;
    let newBalance = userMoney;

    if (winMultiplier > 0) {
      winAmount = betAmount * winMultiplier;
      newBalance = userMoney - betAmount + winAmount;
    } else {
      newBalance = userMoney - betAmount;
    }

    await usersData.set(senderID, {
      money: newBalance,
      data: userData.data
    });

    api.sendMessage({
      attachment: fs.createReadStream(gifPath)
    }, threadID, () => fs.unlinkSync(gifPath));
  }
};
=======
    aliases: ["slots"],
    version: "2.0",
    author: "CharlesMK",
    countDown: 30,
    role: 0,
    description: {
      en: "Spin the slot machine and win money! (10 spins per hour)"
    },
    category: "game",
    guide: {
      en: "{pn} <amount>\nExample: {pn} 50\n\n⏰ Limit: 10 spins per hour"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;

    // Format balance — handles numbers of any size cleanly
    function formatBalance(num) {
      const abs = Math.abs(num);
      const sign = num < 0 ? "-" : "";
      const tiers = [
        [1e24, "septillion"],
        [1e21, "sextillion"],
        [1e18, "quintillion"],
        [1e15, "quadrillion"],
        [1e12, "trillion"],
        [1e9,  "billion"],
        [1e6,  "M"],
      ];
      for (const [val, suffix] of tiers) {
        if (abs >= val) {
          const divided = abs / val;
          const formatted = Number.isInteger(divided)
            ? divided.toString()
            : parseFloat(divided.toFixed(2)).toString();
          const sep = suffix.length <= 2 ? "" : " ";
          return `${sign}$${formatted}${sep}${suffix}`;
        }
      }
      return `${sign}$${abs.toLocaleString()}`;
    }

    // Check if user wants to see their remaining spins
    if (args[0] && args[0].toLowerCase() === "status") {
      const usage = slotUsage.get(senderID);

      if (!usage || usage.spins < 10) {
        const spinsLeft = usage ? 10 - usage.spins : 10;
        return message.reply(
          `🎰 SLOT STATUS\n\n` +
          `🎮 Spins remaining: ${spinsLeft}/10\n` +
          `✅ Ready to play!`
        );
      }

      const now = Date.now();
      const timeLeft = usage.resetTime - now;

      if (timeLeft <= 0) {
        slotUsage.delete(senderID);
        return message.reply(
          `🎰 SLOT STATUS\n\n` +
          `🎮 Spins remaining: 10/10\n` +
          `✅ Your spins have been reset!`
        );
      }

      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      return message.reply(
        `🎰 SLOT STATUS\n\n` +
        `🎮 Spins used: 10/10\n` +
        `⏰ Cooldown: ${minutes}m ${seconds}s\n\n` +
        `Come back later to spin again!`
      );
    }

    const spinAmount = parseInt(args[0]);
    if (!spinAmount || spinAmount <= 0) {
      return message.reply("❌ Please enter a valid amount.\nExample: +slot 50\n\nCheck status: +slot status");
    }

    // Get or initialize user's slot usage
    const now = Date.now();
    let usage = slotUsage.get(senderID);

    // Reset if cooldown period has passed
    if (usage && now >= usage.resetTime) {
      slotUsage.delete(senderID);
      usage = null;
    }

    // Initialize usage if not exists
    if (!usage) {
      usage = {
        spins: 0,
        resetTime: now + 3600000 // 1 hour from now
      };
      slotUsage.set(senderID, usage);
    }

    // Check if user has exceeded spin limit
    if (usage.spins >= 10) {
      const timeLeft = usage.resetTime - now;
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      return message.reply(
        `⏰ SLOT COOLDOWN\n\n` +
        `You've used all 10 spins! 🎰\n\n` +
        `⏳ Time remaining: ${minutes}m ${seconds}s\n\n` +
        `Come back later to play again!\n` +
        `Check status anytime: +slot status`
      );
    }

    const userData = await usersData.get(senderID);
    const balance = userData.money || 0;

    if (spinAmount > balance) {
      return message.reply(
        `❌ You don't have enough money to spin $${spinAmount}.\n💰 Your balance: ${formatBalance(balance)}`
      );
    }

    const slots = ["🍒", "🍋", "🍉", "💎", "7️⃣"];
    const spin = () => slots[Math.floor(Math.random() * slots.length)];

    const reel1 = spin();
    const reel2 = spin();
    const reel3 = spin();

    // Box display for reels
    const reelDisplay =
      `🎰 SLOT MACHINE\n\n` +
      `┌───────────────┐\n` +
      `│  ${reel1}  |  ${reel2}  |  ${reel3}  │\n` +
      `└───────────────┘`;

    const chance = Math.random();
    let reward = 0;
    let resultText = "";

    if (chance < 0.1) {
      // JACKPOT 10% - 6x multiplier
      reward = spinAmount * 6;
      resultText =
        `${reelDisplay}\n\n` +
        `🎉 𝙅𝘼𝘾𝙆𝙋𝙊𝙏 𝙒𝙄𝙉 🎉\n` +
        `+$${reward}`;
    } else if (chance < 0.6) {
      // NORMAL WIN 50% - 2x multiplier
      reward = spinAmount * 2;
      resultText =
        `${reelDisplay}\n\n` +
        `✨ 𝙔𝙊𝙐 𝙒𝙊𝙉!\n` +
        `+$${reward}`;
    } else {
      // LOSS 40%
      reward = -spinAmount;
      resultText =
        `${reelDisplay}\n\n` +
        `💸 𝙔𝙊𝙐 𝙇𝙊𝙎𝙏\n` +
        `-$${spinAmount}`;
    }

    const newBalance = balance + reward;

    // Increment spin count
    usage.spins += 1;
    slotUsage.set(senderID, usage);

    const spinsLeft = 10 - usage.spins;

    await usersData.set(senderID, {
      money: newBalance,
      exp: userData.exp,
      data: userData.data
    });

    const spinInfo = spinsLeft > 0
      ? `🎮 𝗦𝗽𝗶𝗻𝘀: ${spinsLeft}/10`
      : `⏰ 𝗡𝗼 𝘀𝗽𝗶𝗻𝘀 𝗹𝗲𝗳𝘁! Cooldown: 1 hour`;

    return message.reply(
      `${resultText}\n\n` +
      `💰 𝗕𝗔𝗟𝗔𝗡𝗖𝗘: ${formatBalance(newBalance)}\n` +
      `${spinInfo}`
    );
  }
};
>>>>>>> 9bbaa51 (update)
