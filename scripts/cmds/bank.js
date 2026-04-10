<<<<<<< HEAD

const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "bank",
		aliases: [],
		version: "2.4.71",
		author: "ST BOT",
		countDown: 5,
		role: 0,
		description: {
			en: "ST BOT Banking System - Complete banking solution with loans, investments, games, and more"
		},
		category: "economy",
		guide: {
			en: "   {pn} register - Register for bank account\n"
				+ "   {pn} balance [@mention] - Check bank balance\n"
				+ "   {pn} deposit <amount> [duration] - Deposit money (duration: 1h, 1d, 1w, 1m, permanent)\n"
				+ "   {pn} withdraw <amount> - Withdraw money from bank\n"
				+ "   {pn} tobank <amount> - Move money from wallet to bank (1% fee per $1000)\n"
				+ "   {pn} towallet <amount> - Move money from bank to wallet (1% fee per $1000)\n"
				+ "   {pn} transfer <@mention|reply> <amount> - Transfer money\n"
				+ "   {pn} loan <amount> - Take a loan (5% interest)\n"
				+ "   {pn} payloan <amount> - Pay back loan\n"
				+ "   {pn} invest <amount> <duration> - Invest money (1h-1m)\n"
				+ "   {pn} daily - Claim daily reward\n"
				+ "   {pn} lottery - Play free daily lottery\n"
				+ "   {pn} spin <bet> - Spin slot machine\n"
				+ "   {pn} coinflip <bet> <heads|tails> - Flip a coin\n"
				+ "   {pn} trade <buy|sell> <amount> - Trade coins\n"
				+ "   {pn} transactions - View transaction history\n"
				+ "   {pn} leaderboard - View bank rankings"
		}
	},

	langs: {
		en: {
			notRegistered: "❌ You don't have a bank account! Use '/bank register' to create one.",
			registered: "✅ Bank account created successfully!\n💰 Welcome bonus: $500",
			alreadyRegistered: "❌ You already have a bank account!",
			balance: "🏦 Bank Balance\n━━━━━━━━━━━━━━━\n👤 User: %1\n💰 Balance: $%2\n📊 Total Deposited: $%3\n📤 Total Withdrawn: $%4\n💳 Loan: $%5\n📅 Member Since: %6",
			depositSuccess: "✅ Deposited $%1 to your bank account!\n💰 New Balance: $%2",
			withdrawSuccess: "✅ Withdrawn $%1 from your bank account!\n💰 New Balance: $%2",
			insufficientFunds: "❌ Insufficient funds in your wallet!",
			insufficientBank: "❌ Insufficient funds in your bank account!",
			transferSuccess: "✅ Transferred $%1 to %2\n💰 Your New Balance: $%3",
			loanTaken: "✅ Loan of $%1 approved!\n💳 Interest Rate: 5%\n⚠️ Total to repay: $%2",
			hasLoan: "❌ You already have an active loan! Pay it back first.",
			loanPaid: "✅ Paid $%1 towards your loan!\n💳 Remaining: $%2",
			noLoan: "❌ You don't have any active loan!",
			investSuccess: "✅ Invested $%1 for %2\n📈 Expected Return: $%3\n⏰ Matures at: %4",
			dailyClaimed: "🎁 Daily Reward Claimed!\n💰 +$%1\n🔥 Streak: %2 days\n⏰ Come back tomorrow!",
			alreadyClaimed: "❌ You already claimed your daily reward!\n⏰ Come back in %1",
			lotteryWon: "🎉 JACKPOT! You won $%1 from the lottery!\n🍀 Lucky number: %2",
			lotteryLost: "😔 Better luck next time!\n🍀 Your number: %1 | Winning number: %2",
			alreadyPlayedLottery: "❌ You already played lottery today!\n⏰ Come back tomorrow!",
			spinResult: "🎰 SLOT MACHINE\n━━━━━━━━━━━━\n%1\n━━━━━━━━━━━━\n%2",
			coinflipWin: "🪙 Coin landed on %1!\n✅ You won $%2!",
			coinflipLose: "🪙 Coin landed on %1!\n❌ You lost $%2!",
			tradeSuccess: "📊 Trade executed!\n%1 %2 coins\n💰 New Balance: $%3"
		}
	},

	ST: async function ({ args, message, event, usersData, getLang, api }) {
		const { bankData } = global.db;
		const { senderID, messageReply } = event;
		const command = args[0]?.toLowerCase();

		// Register
		if (command === "register") {
			const existingBankData = await bankData.get(senderID);
			if (existingBankData && existingBankData.userID) {
				return message.reply(getLang("alreadyRegistered"));
			}
			await bankData.create(senderID);
			await usersData.addMoney(senderID, 500);
			return message.reply(getLang("registered"));
		}

		// Check if user is registered
		const userBankDataCheck = await bankData.get(senderID);
		if (!userBankDataCheck || !userBankDataCheck.userID) {
			return message.reply(getLang("notRegistered"));
		}

		const userData = await usersData.get(senderID);
		const userBankData = await bankData.get(senderID);

		switch (command) {
			case "balance":
			case "bal": {
				let targetID = senderID;
				if (Object.keys(event.mentions).length > 0) {
					targetID = Object.keys(event.mentions)[0];
				} else if (messageReply) {
					targetID = messageReply.senderID;
				}

				const targetBankDataCheck = await bankData.get(targetID);
				if (!targetBankDataCheck || !targetBankDataCheck.userID) {
					return message.reply("❌ User doesn't have a bank account!");
				}

				const targetBankData = await bankData.get(targetID);
				const targetUserData = await usersData.get(targetID);
				const memberSince = moment(targetBankData.registeredAt).format("MMM DD, YYYY");

				return message.reply(getLang("balance",
					targetUserData.name,
					targetBankData.bankBalance.toLocaleString(),
					targetBankData.totalDeposited.toLocaleString(),
					targetBankData.totalWithdrawn.toLocaleString(),
					targetBankData.loan.amount.toLocaleString(),
					memberSince
				));
			}

			case "deposit": {
				const amount = parseInt(args[1]);
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userData.money < amount) {
					return message.reply(getLang("insufficientFunds"));
				}

				const duration = args[2];
				const depositData = {
					amount,
					depositedAt: new Date(),
					duration: duration || "permanent",
					withdrawable: !duration || duration === "permanent"
				};

				if (duration && duration !== "permanent") {
					const durationMs = parseDuration(duration);
					if (!durationMs) {
						return message.reply("❌ Invalid duration! Use: 1h, 1d, 1w, 1m, or permanent");
					}
					depositData.maturesAt = new Date(Date.now() + durationMs);
					depositData.interest = calculateInterest(amount, duration);
				}

				await usersData.subtractMoney(senderID, amount);
				userBankData.deposits.push(depositData);
				userBankData.bankBalance += amount;
				userBankData.totalDeposited += amount;
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "deposit",
					amount,
					duration: duration || "permanent"
				});

				return message.reply(getLang("depositSuccess", amount.toLocaleString(), userBankData.bankBalance.toLocaleString()));
			}

			case "withdraw": {
				const amount = parseInt(args[1]);
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userBankData.bankBalance < amount) {
					return message.reply(getLang("insufficientBank"));
				}

				// Check for locked deposits
				const availableBalance = calculateAvailableBalance(userBankData);
				if (availableBalance < amount) {
					return message.reply(`❌ Only $${availableBalance.toLocaleString()} is available for withdrawal!\nSome funds are locked in time deposits.`);
				}

				await usersData.addMoney(senderID, amount);
				userBankData.bankBalance -= amount;
				userBankData.totalWithdrawn += amount;
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "withdraw",
					amount
				});

				return message.reply(getLang("withdrawSuccess", amount.toLocaleString(), userBankData.bankBalance.toLocaleString()));
			}

			case "transfer": {
				let targetID = Object.keys(event.mentions)[0];
				let amount = parseInt(args[2]);

				if (messageReply) {
					targetID = messageReply.senderID;
					amount = parseInt(args[1]);
				}

				if (!targetID) {
					return message.reply("❌ Please mention someone or reply to their message!");
				}
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userBankData.bankBalance < amount) {
					return message.reply(getLang("insufficientBank"));
				}
				const targetBankCheck = await bankData.get(targetID);
				if (!targetBankCheck || !targetBankCheck.userID) {
					return message.reply("❌ Target user doesn't have a bank account!");
				}

				const targetBankData = await bankData.get(targetID);
				const targetUserData = await usersData.get(targetID);

				userBankData.bankBalance -= amount;
				targetBankData.bankBalance += amount;

				await bankData.set(senderID, userBankData);
				await bankData.set(targetID, targetBankData);
				await bankData.addTransaction(senderID, {
					type: "transfer_out",
					amount,
					to: targetID
				});
				await bankData.addTransaction(targetID, {
					type: "transfer_in",
					amount,
					from: senderID
				});

				return message.reply(getLang("transferSuccess", amount.toLocaleString(), targetUserData.name, userBankData.bankBalance.toLocaleString()));
			}

			case "loan": {
				const amount = parseInt(args[1]);
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userBankData.banned.isBanned) {
					const canUnban = new Date(userBankData.banned.canUnbanAt);
					const now = new Date();
					if (now < canUnban) {
						return message.reply(`❌ You are banned from bank services!\n📛 Reason: ${userBankData.banned.reason}\n⏰ Can request unban after: ${moment(canUnban).format("MMM DD, YYYY HH:mm")}`);
					}
				}
				if (userBankData.loan.amount > 0) {
					return message.reply(getLang("hasLoan"));
				}
				if (userBankData.loanRequests.some(r => r.status === "pending")) {
					return message.reply("❌ You already have a pending loan request!");
				}

				const interestAmount = Math.floor(amount * 0.05);
				const totalRepay = amount + interestAmount;
				const requestID = Date.now().toString();

				const loanRequest = {
					requestID,
					amount,
					totalRepay,
					requestedAt: new Date(),
					status: "pending",
					threadID: event.threadID
				};

				userBankData.loanRequests.push(loanRequest);
				await bankData.set(senderID, userBankData);

				// Send to admin thread
				const mainThreadID = global.GoatBot.config.mainThreadId;
				const threadData = await api.getThreadInfo(event.threadID);
				const threadName = threadData.threadName || "Unknown Thread";

				api.sendMessage(
					`🏦 NEW LOAN REQUEST\n━━━━━━━━━━━━━━━━\n` +
					`👤 User: ${userData.name}\n` +
					`💰 Amount: $${amount.toLocaleString()}\n` +
					`💳 Total to Repay: $${totalRepay.toLocaleString()}\n` +
					`📍 Thread: ${threadName}\n` +
					`🆔 Request ID: ${requestID}\n` +
					`⏰ Requested: ${moment().format("MMM DD, YYYY HH:mm")}\n\n` +
					`Reply "yes" to approve or "no" to reject`,
					mainThreadID,
					(err, info) => {
						if (!err) {
							global.GoatBot.onReply.set(info.messageID, {
								commandName: "bank",
								messageID: info.messageID,
								author: senderID,
								requestID,
								type: "loanApproval",
								amount,
								totalRepay,
								threadID: event.threadID
							});
						}
					}
				);

				return message.reply(`✅ Loan request submitted!\n💰 Amount: $${amount.toLocaleString()}\n💳 Total to Repay: $${totalRepay.toLocaleString()}\n⏰ Waiting for admin approval...`);
			}

			case "payloan": {
				if (userBankData.loan.amount === 0) {
					return message.reply(getLang("noLoan"));
				}

				let payAmount;

				// Check if user wants to pay full amount (no args or "full" or "all")
				if (!args[1] || args[1].toLowerCase() === "full" || args[1].toLowerCase() === "all") {
					payAmount = userBankData.loan.amount;
					if (userBankData.bankBalance < payAmount) {
						return message.reply(`❌ Insufficient bank balance to pay full loan!\n💳 Loan Amount: $${userBankData.loan.amount.toLocaleString()}\n💰 Your Balance: $${userBankData.bankBalance.toLocaleString()}\n📝 Use: bank payloan <amount> to pay partial`);
					}
				} else {
					// Manual amount entry
					const amount = parseInt(args[1]);
					if (isNaN(amount) || amount <= 0) {
						return message.reply("❌ Invalid amount! Use a number or leave empty to pay full loan.");
					}
					if (userBankData.bankBalance < amount) {
						return message.reply(getLang("insufficientBank"));
					}
					payAmount = Math.min(amount, userBankData.loan.amount);
				}

				userBankData.bankBalance -= payAmount;
				userBankData.loan.amount -= payAmount;
				
				const isFullyPaid = userBankData.loan.amount === 0;
				
				if (isFullyPaid) {
					userBankData.loan.takenAt = null;
					userBankData.loan.dueDate = null;
					userBankData.loan.threadID = null;
				}
				
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "loan_payment",
					amount: payAmount
				});

				if (isFullyPaid) {
					return message.reply(`✅ Loan fully paid!\n💰 Paid: $${payAmount.toLocaleString()}\n🎉 You're debt-free!\n💰 New Balance: $${userBankData.bankBalance.toLocaleString()}`);
				} else {
					return message.reply(getLang("loanPaid", payAmount.toLocaleString(), userBankData.loan.amount.toLocaleString()));
				}
			}

			case "tobank": {
				const amount = parseInt(args[1]);
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userData.money < amount) {
					return message.reply(getLang("insufficientFunds"));
				}

				// 1% fee per $1000
				const fee = Math.floor((amount / 1000) * 10);
				const totalCost = amount + fee;

				if (userData.money < totalCost) {
					return message.reply(`❌ You need $${totalCost.toLocaleString()} (including $${fee.toLocaleString()} fee)!`);
				}

				await usersData.subtractMoney(senderID, totalCost);
				userBankData.bankBalance += amount;
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "wallet_to_bank",
					amount
				});

				return message.reply(`✅ Transferred $${amount.toLocaleString()} to bank!\n💸 Fee: $${fee.toLocaleString()}\n💰 New Bank Balance: $${userBankData.bankBalance.toLocaleString()}`);
			}

			case "towallet": {
				const amount = parseInt(args[1]);
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userBankData.bankBalance < amount) {
					return message.reply(getLang("insufficientBank"));
				}

				// 1% fee per $1000
				const fee = Math.floor((amount / 1000) * 10);
				const amountAfterFee = amount - fee;

				if (amountAfterFee <= 0) {
					return message.reply("❌ Amount too small after fee deduction!");
				}

				userBankData.bankBalance -= amount;
				await usersData.addMoney(senderID, amountAfterFee);
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "bank_to_wallet",
					amount: amountAfterFee
				});

				return message.reply(`✅ Transferred $${amountAfterFee.toLocaleString()} to wallet!\n💸 Fee: $${fee.toLocaleString()}\n💵 New Wallet Balance: $${(userData.money + amountAfterFee).toLocaleString()}`);
			}

			case "invest": {
				const amount = parseInt(args[1]);
				const duration = args[2];

				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}
				if (userBankData.bankBalance < amount) {
					return message.reply(getLang("insufficientBank"));
				}
				if (!duration) {
					return message.reply("❌ Please specify duration! (1h, 1d, 1w, 1m)");
				}

				const durationMs = parseDuration(duration);
				if (!durationMs) {
					return message.reply("❌ Invalid duration! Use: 1h, 1d, 1w, 1m");
				}

				const returnRate = getInvestmentReturn(duration);
				const expectedReturn = Math.floor(amount * returnRate);
				const maturesAt = new Date(Date.now() + durationMs);

				const investment = {
					amount,
					investedAt: new Date(),
					maturesAt,
					expectedReturn,
					duration
				};

				userBankData.investments.push(investment);
				userBankData.bankBalance -= amount;
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "investment",
					amount,
					duration
				});

				return message.reply(getLang("investSuccess",
					amount.toLocaleString(),
					duration,
					expectedReturn.toLocaleString(),
					moment(maturesAt).format("MMM DD, YYYY HH:mm")
				));
			}

			case "daily": {
				const today = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
				if (userBankData.dailyClaim.lastClaimed === today) {
					const tomorrow = moment.tz("Asia/Dhaka").add(1, 'day').startOf('day');
					const timeLeft = tomorrow.diff(moment.tz("Asia/Dhaka"));
					const hours = Math.floor(timeLeft / (1000 * 60 * 60));
					const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
					return message.reply(getLang("alreadyClaimed", `${hours}h ${minutes}m`));
				}

				userBankData.dailyClaim.streak += 1;
				userBankData.dailyClaim.lastClaimed = today;
				const reward = 100 + (userBankData.dailyClaim.streak * 10);

				userBankData.bankBalance += reward;
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "daily_claim",
					amount: reward
				});

				return message.reply(getLang("dailyClaimed", reward.toLocaleString(), userBankData.dailyClaim.streak));
			}

			case "lottery": {
				const today = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
				if (userBankData.lottery.lastPlayed === today) {
					return message.reply(getLang("alreadyPlayedLottery"));
				}

				const userNumber = Math.floor(Math.random() * 100);
				const winningNumber = Math.floor(Math.random() * 100);

				if (Math.abs(userNumber - winningNumber) <= 10) {
					const prize = 1000;
					userBankData.bankBalance += prize;
					userBankData.lottery.totalWins += 1;
					userBankData.lottery.lastPlayed = today;
					await bankData.set(senderID, userBankData);
					await bankData.addTransaction(senderID, {
						type: "lottery_win",
						amount: prize
					});
					return message.reply(getLang("lotteryWon", prize.toLocaleString(), winningNumber));
				}

				userBankData.lottery.lastPlayed = today;
				await bankData.set(senderID, userBankData);
				return message.reply(getLang("lotteryLost", userNumber, winningNumber));
			}

			case "spin": {
				const bet = parseInt(args[1]);
				if (isNaN(bet) || bet <= 0) {
					return message.reply("❌ Invalid bet amount!");
				}
				if (userBankData.bankBalance < bet) {
					return message.reply(getLang("insufficientBank"));
				}

				// Send initial spinning message
				const spinningMsg = await message.reply("🎰 SPINNING...\n━━━━━━━━━━━━\n🔄 🔄 🔄\n━━━━━━━━━━━━\n⏳ Please wait...");

				// Wait for dramatic effect
				await new Promise(resolve => setTimeout(resolve, 2000));

				const slots = ["🍒", "🍋", "🍊", "🍇", "💎", "⭐"];
				let winnings = 0;
				let resultText = "";
				let result = [];

				// 30% win rate, 70% lose rate
				const winChance = Math.random();

				if (winChance < 0.30) {
					// WIN - 30% chance
					const winType = Math.random();
					if (winType < 0.05) {
						// 5% chance for jackpot
						const jackpotSlot = slots[4]; // 💎
						result = [jackpotSlot, jackpotSlot, jackpotSlot];
						winnings = bet * 10;
						resultText = `💎 JACKPOT! 💎\n✅ You won $${winnings.toLocaleString()}!\n💰 New Balance: $${(userBankData.bankBalance + winnings).toLocaleString()}`;
					} else if (winType < 0.20) {
						// 15% chance for triple match
						const tripleSlot = slots[Math.floor(Math.random() * 3)]; // Lower value slots
						result = [tripleSlot, tripleSlot, tripleSlot];
						winnings = bet * 5;
						resultText = `🎉 Triple Match!\n✅ You won $${winnings.toLocaleString()}!\n💰 New Balance: $${(userBankData.bankBalance + winnings).toLocaleString()}`;
					} else {
						// 80% chance for double match (within wins)
						const doubleSlot = slots[Math.floor(Math.random() * slots.length)];
						result = [doubleSlot, doubleSlot, slots[Math.floor(Math.random() * slots.length)]];
						winnings = bet * 2;
						resultText = `👍 Double Match!\n✅ You won $${winnings.toLocaleString()}!\n💰 New Balance: $${(userBankData.bankBalance + winnings).toLocaleString()}`;
					}
				} else {
					// LOSE - 70% chance
					result = [
						slots[Math.floor(Math.random() * slots.length)],
						slots[Math.floor(Math.random() * slots.length)],
						slots[Math.floor(Math.random() * slots.length)]
					];
					// Ensure no matches
					while ((result[0] === result[1] && result[1] === result[2]) || 
					       (result[0] === result[1] || result[1] === result[2] || result[0] === result[2])) {
						result = [
							slots[Math.floor(Math.random() * slots.length)],
							slots[Math.floor(Math.random() * slots.length)],
							slots[Math.floor(Math.random() * slots.length)]
						];
					}
					winnings = -bet;
					resultText = `😔 No match!\n❌ You lost $${bet.toLocaleString()}!\n💰 New Balance: $${(userBankData.bankBalance + winnings).toLocaleString()}`;
				}

				userBankData.bankBalance += winnings;
				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: "slot_game",
					amount: winnings
				});

				// Edit message with result
				const finalMsg = `🎰 SLOT MACHINE\n━━━━━━━━━━━━\n${result.join(" | ")}\n━━━━━━━━━━━━\n${resultText}`;
				return api.editMessage(finalMsg, spinningMsg.messageID);
			}

			case "coinflip": {
				const bet = parseInt(args[1]);
				const choice = args[2]?.toLowerCase();

				if (isNaN(bet) || bet <= 0) {
					return message.reply("❌ Invalid bet amount!");
				}
				if (!["heads", "tails"].includes(choice)) {
					return message.reply("❌ Choose heads or tails!");
				}
				if (userBankData.bankBalance < bet) {
					return message.reply(getLang("insufficientBank"));
				}

				const result = Math.random() < 0.5 ? "heads" : "tails";
				const won = result === choice;

				if (won) {
					userBankData.bankBalance += bet;
					await bankData.set(senderID, userBankData);
					await bankData.addTransaction(senderID, {
						type: "coinflip_win",
						amount: bet
					});
					return message.reply(getLang("coinflipWin", result, bet.toLocaleString()));
				} else {
					userBankData.bankBalance -= bet;
					await bankData.set(senderID, userBankData);
					await bankData.addTransaction(senderID, {
						type: "coinflip_loss",
						amount: bet
					});
					return message.reply(getLang("coinflipLose", result, bet.toLocaleString()));
				}
			}

			case "trade": {
				const action = args[1]?.toLowerCase();
				const amount = parseInt(args[2]);

				if (!["buy", "sell"].includes(action)) {
					return message.reply("❌ Use 'buy' or 'sell'!");
				}
				if (isNaN(amount) || amount <= 0) {
					return message.reply("❌ Invalid amount!");
				}

				const rate = 1 + (Math.random() * 0.2 - 0.1); // ±10% fluctuation
				const cost = Math.floor(amount * rate);

				if (action === "buy") {
					if (userBankData.bankBalance < cost) {
						return message.reply(getLang("insufficientBank"));
					}
					userBankData.bankBalance -= cost;
					userBankData.premiumCurrency += amount;
				} else {
					if (userBankData.premiumCurrency < amount) {
						return message.reply("❌ Insufficient premium currency!");
					}
					userBankData.premiumCurrency -= amount;
					userBankData.bankBalance += cost;
				}

				await bankData.set(senderID, userBankData);
				await bankData.addTransaction(senderID, {
					type: `trade_${action}`,
					amount: action === "buy" ? cost : amount
				});

				return message.reply(getLang("tradeSuccess",
					action === "buy" ? "Bought" : "Sold",
					amount,
					userBankData.bankBalance.toLocaleString()
				));
			}

			case "transactions":
			case "history": {
				if (!userBankData.transactions || userBankData.transactions.length === 0) {
					return message.reply("❌ No transactions yet!");
				}

				let msg = "📜 Transaction History (Last 10)\n━━━━━━━━━━━━━━━━\n";
				userBankData.transactions.slice(0, 10).forEach((tx, i) => {
					const time = moment(tx.timestamp).format("MMM DD, HH:mm");
					const sign = tx.type.includes("win") || tx.type.includes("deposit") || tx.type.includes("in") ? "+" : "-";
					msg += `${i + 1}. ${tx.type.toUpperCase()}: ${sign}$${Math.abs(tx.amount).toLocaleString()} - ${time}\n`;
				});

				return message.reply(msg);
			}

			case "leaderboard":
			case "top": {
				const allBanks = global.db.allBankData.sort((a, b) => b.bankBalance - a.bankBalance).slice(0, 10);
				let msg = "🏆 Bank Leaderboard (Top 10)\n━━━━━━━━━━━━━━━━\n";

				for (let i = 0; i < allBanks.length; i++) {
					const user = await usersData.get(allBanks[i].userID);
					const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
					msg += `${medal} ${user.name}: $${allBanks[i].bankBalance.toLocaleString()}\n`;
				}

				return message.reply(msg);
			}

			default:
				return message.SyntaxError();
		}
	},

	onReply: async function ({ event, Reply, message, usersData, api }) {
		const { bankData } = global.db;
		const adminConfig = global.GoatBot.config.adminBot;
		
		if (!adminConfig.includes(event.senderID)) {
			return;
		}

		if (Reply.type === "loanApproval") {
			const response = event.body.toLowerCase().trim();
			const { requestID, amount, totalRepay, threadID, author: requesterID } = Reply;

			if (!["yes", "no"].includes(response)) {
				return message.reply("❌ Reply 'yes' to approve or 'no' to reject!");
			}

			const requesterBankData = await bankData.get(requesterID);
			const requestIndex = requesterBankData.loanRequests.findIndex(r => r.requestID === requestID);

			if (requestIndex === -1) {
				return message.reply("❌ Loan request not found!");
			}

			const requesterUserData = await usersData.get(requesterID);
			const LOAN_DUE_DAYS = 7;

			if (response === "yes") {
				// Approve loan
				const dueDate = new Date();
				dueDate.setDate(dueDate.getDate() + LOAN_DUE_DAYS);

				requesterBankData.loan = {
					amount: totalRepay,
					takenAt: new Date(),
					interestRate: 5,
					dueDate,
					threadID
				};
				requesterBankData.loanRequests[requestIndex].status = "approved";
				requesterBankData.bankBalance += amount;

				await bankData.set(requesterID, requesterBankData);
				await bankData.addTransaction(requesterID, {
					type: "loan_approved",
					amount,
					totalRepay
				});

				// Notify user with mention
				const requesterUserData = await usersData.get(requesterID);
				api.sendMessage(
					{
						body: `@${requesterUserData.name} ✅ LOAN APPROVED!\n━━━━━━━━━━━━━━━━\n` +
							`💰 Amount: $${amount.toLocaleString()}\n` +
							`💳 Total to Repay: $${totalRepay.toLocaleString()}\n` +
							`📅 Due Date: ${moment(dueDate).format("MMM DD, YYYY")}\n` +
							`⚠️ Pay within ${LOAN_DUE_DAYS} days or face ban!`,
						mentions: [{
							tag: `@${requesterUserData.name}`,
							id: requesterID
						}]
					},
					threadID
				);

				return message.reply(`✅ Loan approved for ${requesterUserData.name}!`);
			} else {
				// Reject loan
				requesterBankData.loanRequests[requestIndex].status = "rejected";
				await bankData.set(requesterID, requesterBankData);

				// Notify user with mention
				const requesterUserData = await usersData.get(requesterID);
				api.sendMessage(
					{
						body: `@${requesterUserData.name} ❌ LOAN REJECTED\n━━━━━━━━━━━━━━━━\n` +
							`Your loan request for $${amount.toLocaleString()} was rejected.\n` +
							`You can reapply for a loan anytime.`,
						mentions: [{
							tag: `@${requesterUserData.name}`,
							id: requesterID
						}]
					},
					threadID
				);

				return message.reply(`❌ Loan rejected for ${requesterUserData.name}.`);
			}
		}
	}
};

function parseDuration(duration) {
	const units = {
		'h': 60 * 60 * 1000,
		'd': 24 * 60 * 60 * 1000,
		'w': 7 * 24 * 60 * 60 * 1000,
		'm': 30 * 24 * 60 * 60 * 1000
	};

	const match = duration.match(/^(\d+)([hdwm])$/);
	if (!match) return null;

	const value = parseInt(match[1]);
	const unit = match[2];

	return value * units[unit];
}

function calculateInterest(amount, duration) {
	const rates = {
		'1h': 0.01,
		'1d': 0.02,
		'1w': 0.05,
		'1m': 0.15
	};
	return Math.floor(amount * (rates[duration] || 0));
}

function getInvestmentReturn(duration) {
	const rates = {
		'1h': 1.05,
		'1d': 1.1,
		'1w': 1.25,
		'1m': 1.5
	};
	return rates[duration] || 1.1;
}

function calculateAvailableBalance(userBankData) {
	let locked = 0;
	const now = new Date();

	userBankData.deposits.forEach(deposit => {
		if (!deposit.withdrawable && deposit.maturesAt && new Date(deposit.maturesAt) > now) {
			locked += deposit.amount;
		}
	});

	return userBankData.bankBalance - locked;
}
=======
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");
const moment = require("moment-timezone");

// ── Constants ─────────────────────────────────────────────────
const BANK_NAME           = "MK-GOAT BANK";
const CURRENCY_SYMBOL     = "$";
const INTEREST_RATE       = 0.02;           // 2% daily savings interest
const LOAN_INTEREST_RATE  = 0.05;           // 5% daily loan interest
const MAX_LOAN            = 200000000;      // $200,000,000
const MIN_DEPOSIT         = 100;
const MIN_WITHDRAW        = 100;
const MIN_TRANSFER        = 50;
const MIN_LOAN            = 1000;
const CARD_VALIDITY_YEARS = 5;
const TZ                  = "Asia/Dhaka";

// ── Font registration ─────────────────────────────────────────
const fontPath        = path.join(__dirname, "assets", "font", "BeVietnamPro-Bold.ttf");
const fontPathRegular = path.join(__dirname, "assets", "font", "BeVietnamPro-Regular.ttf");
try {
    if (fs.existsSync(fontPath))        registerFont(fontPath,        { family: "BankFont",        weight: "bold" });
    if (fs.existsSync(fontPathRegular)) registerFont(fontPathRegular, { family: "BankFontRegular" });
} catch (_) {}

// ── Utility functions ─────────────────────────────────────────
function generateAccountNumber() {
    return "GB" + Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}
function generateCardNumber() {
    let c = "4";
    for (let i = 0; i < 15; i++) c += Math.floor(Math.random() * 10);
    return c;
}
function generateCVV()  { return Math.floor(100 + Math.random() * 900).toString(); }
function generatePIN()  { return Math.floor(1000 + Math.random() * 9000).toString(); }
function hashPIN(pin)   { return crypto.createHash("sha256").update(pin + "goatbank_salt").digest("hex"); }
function formatCardNumber(n) { return n.replace(/(.{4})/g, "$1 ").trim(); }
function formatMoney(n)  { return Number(n).toLocaleString("en-US"); }
function now()           { return moment().tz(TZ).format("DD/MM/YYYY HH:mm:ss"); }
function today()         { return moment().tz(TZ).format("DD/MM/YYYY"); }
function generateTransactionId() {
    return "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
}
function getExpiryDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + CARD_VALIDITY_YEARS);
    return (d.getMonth() + 1).toString().padStart(2, "0") + "/" + d.getFullYear().toString().slice(-2);
}

// ── Save user — always spread to preserve all fields ─────────
async function saveUser(usersData, senderID, userData, extraFields = {}) {
    await usersData.set(senderID, {
        ...userData,
        data: userData.data,
        ...extraFields
    });
}

// ── Data structure helpers ────────────────────────────────────
function ensureDataStructure(userData) {
    if (!userData.data) userData.data = {};
    if (!userData.data.bank) userData.data.bank = null;
    if (userData.data.bank?.accountNumber && !userData.data.bank?.isRegistered) {
        userData.data.bank.isRegistered = true;
    }
    return userData;
}

function isRegistered(userData) {
    if (!userData.data?.bank) return false;
    return userData.data.bank.isRegistered === true ||
        (userData.data.bank.accountNumber && userData.data.bank.transactions?.length > 0);
}

function createBankAccount(userData) {
    if (userData.data.bank?.accountNumber) return userData;
    userData.data.bank = {
        isRegistered: true,
        accountNumber: generateAccountNumber(),
        balance: 0,
        savings: 0,
        loan: null,            // { amount, remaining, takenAt, dueDate, interestAccrued }
        transactions: [],
        cards: [],
        dailyWithdraw:  { date: null, amount: 0 },
        dailyTransfer:  { date: null, amount: 0 },
        createdAt: now(),
        lastInterest: null,
        totalDeposited: 0,
        totalWithdrawn: 0,
        totalTransferred: 0
    };
    return userData;
}

// ── Accrue daily loan interest ────────────────────────────────
function accrueInterest(bank) {
    if (!bank.loan || bank.loan.remaining <= 0) return bank;
    const lastDate = bank.loan.lastInterestDate;
    if (!lastDate) { bank.loan.lastInterestDate = today(); return bank; }
    const days = moment(today(), "DD/MM/YYYY").diff(moment(lastDate, "DD/MM/YYYY"), "days");
    if (days <= 0) return bank;
    const interest = Math.floor(bank.loan.remaining * LOAN_INTEREST_RATE * days);
    bank.loan.remaining      += interest;
    bank.loan.interestAccrued = (bank.loan.interestAccrued || 0) + interest;
    bank.loan.lastInterestDate = today();
    return bank;
}

// ── Canvas: Bank Card ─────────────────────────────────────────
async function createBankCard(cardData, userData) {
    const W = 850, H = 540;
    const canvas = createCanvas(W, H);
    const ctx    = canvas.getContext("2d");

    const g = ctx.createLinearGradient(0, 0, W, H);
    if (cardData.cardType === "platinum") {
        g.addColorStop(0, "#1a1a2e"); g.addColorStop(0.3, "#16213e");
        g.addColorStop(0.6, "#0f3460"); g.addColorStop(1, "#1a1a2e");
    } else if (cardData.cardType === "gold") {
        g.addColorStop(0, "#b8860b"); g.addColorStop(0.3, "#daa520");
        g.addColorStop(0.6, "#ffd700"); g.addColorStop(1, "#b8860b");
    } else {
        g.addColorStop(0, "#2c3e50"); g.addColorStop(0.3, "#34495e");
        g.addColorStop(0.6, "#5d6d7e"); g.addColorStop(1, "#2c3e50");
    }
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(0, 0, W, H, 30); ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(10, 10, W - 20, H - 20, 25); ctx.stroke();

    for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.strokeStyle = `rgba(255,255,255,${0.03 + i * 0.01})`;
        ctx.lineWidth = 1; ctx.arc(W * 0.7 + i * 20, H * 0.3 - i * 10, 150 + i * 30, 0, Math.PI * 2); ctx.stroke();
    }

    ctx.fillStyle = "#d4af37"; ctx.beginPath(); ctx.roundRect(50, 150, 90, 70, 8); ctx.fill();
    ctx.strokeStyle = "#a67c00"; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(50, 158 + i * 13); ctx.lineTo(140, 158 + i * 13); ctx.stroke(); }
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(65 + i * 25, 150); ctx.lineTo(65 + i * 25, 220); ctx.stroke(); }

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 32px Arial, sans-serif"; ctx.fillText(BANK_NAME, 50, 80);
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.fillStyle = cardData.cardType === "gold" ? "#1a1a1a" : "#ffffff";
    const typeText = cardData.cardType.toUpperCase();
    ctx.fillText(typeText, W - ctx.measureText(typeText).width - 50, 80);

    ctx.font = "bold 42px Arial, monospace"; ctx.fillStyle = "#ffffff";
    ctx.fillText(formatCardNumber(cardData.cardNumber), 50, 300);

    ctx.font = "bold 16px Arial, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("VALID THRU", 50, 360); ctx.fillText("CVV", 200, 360);
    ctx.font = "bold 22px Arial, monospace"; ctx.fillStyle = "#ffffff";
    ctx.fillText(cardData.expiryDate, 50, 390); ctx.fillText("***", 200, 390);

    ctx.font = "bold 24px Arial, sans-serif"; ctx.fillStyle = "#ffffff";
    ctx.fillText(userData.name.toUpperCase().slice(0, 25), 50, 470);
    ctx.font = "bold 16px Arial, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("DEBIT", W - 100, 470);

    ctx.fillStyle = "#ff5f00"; ctx.beginPath(); ctx.arc(W - 130, 180, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#eb001b"; ctx.beginPath(); ctx.arc(W - 90, 180, 40, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(255,95,0,0.5)"; ctx.beginPath(); ctx.arc(W - 110, 180, 25, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    ctx.font = "12px Arial, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`ACC: ${cardData.accountNumber}`, 50, H - 30);

    const outputPath = path.join(__dirname, "tmp", `card_${cardData.cardNumber.slice(-4)}_${Date.now()}.png`);
    await fs.ensureDir(path.join(__dirname, "tmp"));
    await fs.writeFile(outputPath, canvas.toBuffer("image/png"));
    return outputPath;
}

// ── Canvas: Transaction Receipt ───────────────────────────────
async function createTransactionReceipt(transaction, senderData, receiverData = null) {
    const W = 600, H = 800;
    const canvas = createCanvas(W, H);
    const ctx    = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);

    const hg = ctx.createLinearGradient(0, 0, W, 120);
    hg.addColorStop(0, "#1a1a2e"); hg.addColorStop(1, "#0f3460");
    ctx.fillStyle = hg; ctx.fillRect(0, 0, W, 120);

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 32px Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText(BANK_NAME, W / 2, 55);
    ctx.font = "16px Arial, sans-serif"; ctx.fillText("TRANSACTION RECEIPT", W / 2, 90);
    ctx.textAlign = "left";

    let y = 160;
    const row = (label, value, color = "#1a1a2e") => {
        ctx.font = "bold 14px Arial, sans-serif"; ctx.fillStyle = "#666666"; ctx.fillText(label, 40, y);
        ctx.font = "16px Arial, sans-serif"; ctx.fillStyle = color; ctx.fillText(value, 40, y + 22); y += 56;
    };
    const divider = () => {
        ctx.strokeStyle = "#e0e0e0"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke(); y += 28;
    };

    row("TRANSACTION ID", transaction.transactionId);
    row("DATE & TIME",    transaction.timestamp);
    row("TYPE",           transaction.type.toUpperCase(),
        transaction.type === "deposit" || transaction.type === "received" || transaction.type === "loan_taken" ? "#27ae60" :
        transaction.type === "withdraw" ? "#e74c3c" : "#3498db");

    divider();
    row("FROM", senderData.name + (transaction.fromAccount ? `\n${transaction.fromAccount}` : ""));
    if (receiverData) row("TO", receiverData.name + (transaction.toAccount ? `\n${transaction.toAccount}` : ""));
    divider();

    ctx.font = "bold 16px Arial, sans-serif"; ctx.fillStyle = "#666666"; ctx.fillText("AMOUNT", 40, y);
    const prefix = ["deposit","received","loan_taken"].includes(transaction.type) ? "+" : "-";
    ctx.font = "bold 36px Arial, sans-serif";
    ctx.fillStyle = ["deposit","received","loan_taken"].includes(transaction.type) ? "#27ae60" : "#e74c3c";
    ctx.fillText(`${prefix}${CURRENCY_SYMBOL}${formatMoney(transaction.amount)}`, 40, y + 45); y += 90;

    ctx.font = "bold 14px Arial, sans-serif"; ctx.fillStyle = "#666666"; ctx.fillText("NEW BALANCE", 40, y);
    ctx.font = "bold 24px Arial, sans-serif"; ctx.fillStyle = "#1a1a2e";
    ctx.fillText(`${CURRENCY_SYMBOL}${formatMoney(transaction.newBalance)}`, 40, y + 30); y += 60;

    ctx.fillStyle = "#f5f5f5"; ctx.fillRect(0, H - 100, W, 100);
    ctx.font = "12px Arial, sans-serif"; ctx.fillStyle = "#999999"; ctx.textAlign = "center";
    ctx.fillText("Official receipt from " + BANK_NAME, W / 2, H - 60);
    ctx.fillText("Keep this receipt for your records", W / 2, H - 40);
    ctx.fillText("Customer Service: Available 24/7",   W / 2, H - 20);

    const outputPath = path.join(__dirname, "tmp", `receipt_${transaction.transactionId}.png`);
    await fs.ensureDir(path.join(__dirname, "tmp"));
    await fs.writeFile(outputPath, canvas.toBuffer("image/png"));
    return outputPath;
}

// ── Module ────────────────────────────────────────────────────
module.exports = {
    config: {
        name: "bank",
        aliases: ["atm", "banking"],
        version: "3.0",
        author: "Charles MK",
        countDown: 5,
        role: 0,
        description: "Complete banking system — deposits, withdrawals, transfers, savings, loans & ATM cards",
        category: "economy",
        guide: `{pn} register
{pn} balance
{pn} deposit <amount>
{pn} withdraw <amount>
{pn} transfer <@tag|UID> <amount>
{pn} history
{pn} statement
{pn} card [apply <standard|gold|platinum> | activate | block | pin <4digits>]
{pn} savings [deposit <amount> | withdraw]
{pn} loan [take <amount> | repay <amount> | info]`
    },

    langs: {
        en: {
            menu: `🏦 ${BANK_NAME}
══════════════════════════
💰 deposit      💸 withdraw
🔄 transfer     📊 balance
📜 history      📑 statement
💳 card         🏧 savings
🏦 loan

Type: bank <command> for details`,
            notRegistered:    "❌ No bank account found.\nUse: +bank register",
            alreadyRegistered:"✅ You already have a bank account!",
            invalidAmount:    "❌ Invalid amount!",
            insufficientBalance: "❌ Insufficient bank balance!",
            insufficientWallet:  "❌ Insufficient wallet balance!",
        }
    },

    onStart: async function ({ args, message, event, usersData, getLang }) {
        const { senderID } = event;
        let userData = await usersData.get(senderID);
        userData = ensureDataStructure(userData);
        const action = args[0]?.toLowerCase();

        // ── REGISTER ─────────────────────────────────────────
        if (!action || action === "register") {
            if (!action) return message.reply(getLang("menu"));
            if (isRegistered(userData)) return message.reply(getLang("alreadyRegistered"));
            userData = createBankAccount(userData);
            userData.data.bank.transactions.push({
                transactionId: generateTransactionId(),
                type: "account_opened", amount: 0, newBalance: 0,
                timestamp: now(), description: "Account opened"
            });
            await saveUser(usersData, senderID, userData);
            return message.reply(
                `🎉 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟!\n\n` +
                `🏦 ${BANK_NAME}\n` +
                `━━━━━━━━━━━━━━━━━\n` +
                `📋 Account No: ${userData.data.bank.accountNumber}\n` +
                `💰 Balance: ${CURRENCY_SYMBOL}0\n` +
                `📅 Opened: ${userData.data.bank.createdAt}\n` +
                `━━━━━━━━━━━━━━━━━\n` +
                `Welcome to ${BANK_NAME}!`
            );
        }

        // All commands below require registration
        if (!isRegistered(userData)) return message.reply(getLang("notRegistered"));
        const bank = userData.data.bank;

        // Accrue loan interest on every interaction
        userData.data.bank = accrueInterest(bank);

        switch (action) {

            // ── BALANCE ─────────────────────────────────────
            case "balance":
            case "bal": {
                const loanInfo = bank.loan?.remaining > 0
                    ? `\n🔴 Loan Remaining: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.remaining)}`
                    : "";
                return message.reply(
                    `💳 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗜𝗡𝗙𝗢\n\n` +
                    `🏦 ${BANK_NAME}\n` +
                    `━━━━━━━━━━━━━━━━━\n` +
                    `👤 ${userData.name}\n` +
                    `📋 ${bank.accountNumber}\n` +
                    `💰 Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}\n` +
                    `💎 Savings: ${CURRENCY_SYMBOL}${formatMoney(bank.savings || 0)}` +
                    loanInfo + `\n` +
                    `━━━━━━━━━━━━━━━━━\n` +
                    `📥 Total Deposited: ${CURRENCY_SYMBOL}${formatMoney(bank.totalDeposited || 0)}\n` +
                    `📤 Total Withdrawn: ${CURRENCY_SYMBOL}${formatMoney(bank.totalWithdrawn || 0)}`
                );
            }

            // ── DEPOSIT ──────────────────────────────────────
            case "deposit":
            case "dep": {
                const amount = parseInt(args[1]);
                if (isNaN(amount) || amount <= 0)  return message.reply(getLang("invalidAmount"));
                if (amount < MIN_DEPOSIT)           return message.reply(`❌ Minimum deposit: ${CURRENCY_SYMBOL}${formatMoney(MIN_DEPOSIT)}`);
                if (userData.money < amount)        return message.reply(getLang("insufficientWallet"));

                const tx = {
                    transactionId: generateTransactionId(), type: "deposit",
                    amount, fromAccount: "Wallet",
                    newBalance: bank.balance + amount,
                    timestamp: now(), description: "Wallet to Bank"
                };
                bank.balance        += amount;
                bank.totalDeposited  = (bank.totalDeposited || 0) + amount;
                bank.transactions.unshift(tx);
                if (bank.transactions.length > 50) bank.transactions.length = 50;

                await saveUser(usersData, senderID, userData, { money: userData.money - amount });

                const rp = await createTransactionReceipt(tx, userData);
                return message.reply({
                    body: `✅ 𝗗𝗘𝗣𝗢𝗦𝗜𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n\n` +
                          `💰 Amount: ${CURRENCY_SYMBOL}${formatMoney(amount)}\n` +
                          `💳 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}\n` +
                          `🔖 ID: ${tx.transactionId}`,
                    attachment: fs.createReadStream(rp)
                }, () => fs.remove(rp));
            }

            // ── WITHDRAW ─────────────────────────────────────
            case "withdraw":
            case "wd": {
                const amount = parseInt(args[1]);
                if (isNaN(amount) || amount <= 0)  return message.reply(getLang("invalidAmount"));
                if (amount < MIN_WITHDRAW)          return message.reply(`❌ Minimum withdrawal: ${CURRENCY_SYMBOL}${formatMoney(MIN_WITHDRAW)}`);
                if (bank.balance < amount)          return message.reply(getLang("insufficientBalance"));

                const tx = {
                    transactionId: generateTransactionId(), type: "withdraw",
                    amount, fromAccount: bank.accountNumber,
                    newBalance: bank.balance - amount,
                    timestamp: now(), description: "Bank to Wallet"
                };
                bank.balance       -= amount;
                bank.totalWithdrawn = (bank.totalWithdrawn || 0) + amount;
                bank.transactions.unshift(tx);
                if (bank.transactions.length > 50) bank.transactions.length = 50;

                await saveUser(usersData, senderID, userData, { money: userData.money + amount });

                const rp = await createTransactionReceipt(tx, userData);
                return message.reply({
                    body: `✅ 𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪𝗔𝗟 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n\n` +
                          `💸 Amount: ${CURRENCY_SYMBOL}${formatMoney(amount)}\n` +
                          `💳 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}\n` +
                          `👛 Wallet: ${CURRENCY_SYMBOL}${formatMoney(userData.money + amount)}\n` +
                          `🔖 ID: ${tx.transactionId}`,
                    attachment: fs.createReadStream(rp)
                }, () => fs.remove(rp));
            }

            // ── TRANSFER ─────────────────────────────────────
            case "transfer":
            case "tf": {
                let targetID, amount;
                if (Object.keys(event.mentions).length > 0) {
                    targetID = Object.keys(event.mentions)[0];
                    amount   = parseInt(args[2]) || parseInt(args[1]);
                } else {
                    targetID = args[1];
                    amount   = parseInt(args[2]);
                }

                if (!targetID || isNaN(amount) || amount <= 0) return message.reply("Usage: +bank transfer <@user|UID> <amount>");
                if (amount < MIN_TRANSFER)   return message.reply(`❌ Minimum transfer: ${CURRENCY_SYMBOL}${formatMoney(MIN_TRANSFER)}`);
                if (bank.balance < amount)   return message.reply(getLang("insufficientBalance"));
                if (targetID == senderID)    return message.reply("❌ You cannot transfer to yourself!");

                let targetData = await usersData.get(targetID);
                targetData = ensureDataStructure(targetData);
                if (!isRegistered(targetData)) return message.reply("❌ Recipient doesn't have a bank account!");

                const txID = generateTransactionId();
                const stamp = now();

                const txSender = {
                    transactionId: txID, type: "transfer", amount,
                    fromAccount: bank.accountNumber, toAccount: targetData.data.bank.accountNumber,
                    newBalance: bank.balance - amount, timestamp: stamp,
                    description: `Transfer to ${targetData.name}`
                };
                const txReceiver = {
                    transactionId: txID, type: "received", amount,
                    fromAccount: bank.accountNumber, toAccount: targetData.data.bank.accountNumber,
                    newBalance: targetData.data.bank.balance + amount, timestamp: stamp,
                    description: `Received from ${userData.name}`
                };

                bank.balance             -= amount;
                bank.totalTransferred     = (bank.totalTransferred || 0) + amount;
                bank.transactions.unshift(txSender);
                if (bank.transactions.length > 50) bank.transactions.length = 50;

                targetData.data.bank.balance += amount;
                targetData.data.bank.transactions.unshift(txReceiver);
                if (targetData.data.bank.transactions.length > 50) targetData.data.bank.transactions.length = 50;

                await saveUser(usersData, senderID, userData);
                await saveUser(usersData, targetID, targetData);

                const rp = await createTransactionReceipt(txSender, userData, targetData);
                return message.reply({
                    body: `✅ 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n\n` +
                          `📤 From: ${userData.name}\n` +
                          `📥 To: ${targetData.name}\n` +
                          `💰 Amount: ${CURRENCY_SYMBOL}${formatMoney(amount)}\n` +
                          `💳 Your Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}\n` +
                          `🔖 ID: ${txID}`,
                    attachment: fs.createReadStream(rp)
                }, () => fs.remove(rp));
            }

            // ── HISTORY ──────────────────────────────────────
            case "history":
            case "his": {
                if (bank.transactions.length === 0) return message.reply("📭 No transactions yet!");
                const icons = { deposit: "💰", withdraw: "💸", transfer: "📤", received: "📥",
                                savings_deposit: "🏧", savings_withdraw: "🏧",
                                loan_taken: "🏦", loan_repay: "💳", account_opened: "📋" };
                const signs = { deposit: "+", received: "+", savings_withdraw: "+", loan_taken: "+", withdraw: "-", transfer: "-", savings_deposit: "-", loan_repay: "-" };

                let msg = `📜 𝗧𝗥𝗔𝗡𝗦𝗔𝗖𝗧𝗜𝗢𝗡 𝗛𝗜𝗦𝗧𝗢𝗥𝗬\n━━━━━━━━━━━━━━━━━\n`;
                bank.transactions.slice(0, 10).forEach((tx, i) => {
                    const icon = icons[tx.type] || "📋";
                    const sign = signs[tx.type] || "";
                    msg += `${i + 1}. ${icon} ${tx.type.replace(/_/g, " ").toUpperCase()}\n`;
                    msg += `   ${sign}${CURRENCY_SYMBOL}${formatMoney(tx.amount)}  |  ${tx.timestamp}\n`;
                });
                return message.reply(msg);
            }

            // ── STATEMENT ────────────────────────────────────
            case "statement":
            case "stmt": {
                const loanLine = bank.loan?.remaining > 0
                    ? `\n🔴 Loan Outstanding: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.remaining)}\n📈 Interest Accrued: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.interestAccrued || 0)}`
                    : "\n✅ No active loan";
                return message.reply(
                    `📑 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗦𝗧𝗔𝗧𝗘𝗠𝗘𝗡𝗧\n` +
                    `━━━━━━━━━━━━━━━━━━━━━\n` +
                    `🏦 ${BANK_NAME}\n👤 ${userData.name}\n📋 ${bank.accountNumber}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━\n` +
                    `💰 Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}\n` +
                    `💎 Savings: ${CURRENCY_SYMBOL}${formatMoney(bank.savings || 0)}` +
                    loanLine + `\n` +
                    `━━━━━━━━━━━━━━━━━━━━━\n` +
                    `📊 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦\n` +
                    `📥 Deposited: ${CURRENCY_SYMBOL}${formatMoney(bank.totalDeposited || 0)}\n` +
                    `📤 Withdrawn: ${CURRENCY_SYMBOL}${formatMoney(bank.totalWithdrawn || 0)}\n` +
                    `🔄 Transferred: ${CURRENCY_SYMBOL}${formatMoney(bank.totalTransferred || 0)}\n` +
                    `💳 Cards: ${bank.cards?.length || 0}\n` +
                    `📋 Transactions: ${bank.transactions.length}\n` +
                    `📅 Opened: ${bank.createdAt}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━`
                );
            }

            // ── CARD ─────────────────────────────────────────
            case "card": {
                const cardAction = args[1]?.toLowerCase();

                if (!cardAction) {
                    if (!bank.cards?.length) return message.reply("❌ No ATM card.\nUse: +bank card apply <standard|gold|platinum>");
                    const card = bank.cards[0];
                    const cardPath = await createBankCard(card, userData);
                    return message.reply({
                        body: `💳 𝗬𝗢𝗨𝗥 𝗔𝗧𝗠 𝗖𝗔𝗥𝗗\n━━━━━━━━━━━━━━━━━\n` +
                              `📋 ${formatCardNumber(card.cardNumber)}\n` +
                              `📅 Expiry: ${card.expiryDate}\n` +
                              `🔒 Status: ${card.isActive ? "Active ✅" : "Blocked ❌"}\n` +
                              `💎 Type: ${card.cardType.toUpperCase()}`,
                        attachment: fs.createReadStream(cardPath)
                    }, () => fs.remove(cardPath));
                }

                switch (cardAction) {
                    case "apply": {
                        if (bank.cards?.length) return message.reply("❌ You already have a card!");
                        const cardType = args[2]?.toLowerCase() || "standard";
                        if (!["standard","gold","platinum"].includes(cardType))
                            return message.reply("❌ Card types: standard, gold, platinum");
                        const minBal = cardType === "platinum" ? 50000 : cardType === "gold" ? 10000 : 0;
                        if (bank.balance < minBal)
                            return message.reply(`❌ ${cardType} card requires min balance: ${CURRENCY_SYMBOL}${formatMoney(minBal)}`);

                        const pin = generatePIN();
                        const newCard = {
                            cardNumber: generateCardNumber(), cvv: generateCVV(),
                            pin: hashPIN(pin), expiryDate: getExpiryDate(),
                            cardType, isActive: true,
                            issuedAt: now(), accountNumber: bank.accountNumber
                        };
                        bank.cards = [newCard];
                        await saveUser(usersData, senderID, userData);

                        const cardPath = await createBankCard(newCard, userData);
                        return message.reply({
                            body: `✅ 𝗖𝗔𝗥𝗗 𝗜𝗦𝗦𝗨𝗘𝗗\n━━━━━━━━━━━━━━━━━\n` +
                                  `📋 ${formatCardNumber(newCard.cardNumber)}\n` +
                                  `📅 Expiry: ${newCard.expiryDate}\n` +
                                  `🔐 CVV: ${newCard.cvv}\n` +
                                  `🔑 PIN: ${pin}\n` +
                                  `💎 Type: ${cardType.toUpperCase()}\n` +
                                  `━━━━━━━━━━━━━━━━━\n⚠️ Keep your PIN safe!`,
                            attachment: fs.createReadStream(cardPath)
                        }, () => fs.remove(cardPath));
                    }
                    case "activate": {
                        if (!bank.cards?.length) return message.reply("❌ No card found.");
                        bank.cards[0].isActive = true;
                        await saveUser(usersData, senderID, userData);
                        return message.reply("✅ Card activated!");
                    }
                    case "block": {
                        if (!bank.cards?.length) return message.reply("❌ No card found.");
                        bank.cards[0].isActive = false;
                        await saveUser(usersData, senderID, userData);
                        return message.reply("✅ Card blocked!");
                    }
                    case "pin": {
                        if (!bank.cards?.length) return message.reply("❌ No card found.");
                        const newPin = args[2];
                        if (!newPin || !/^\d{4}$/.test(newPin)) return message.reply("❌ PIN must be exactly 4 digits.");
                        bank.cards[0].pin = hashPIN(newPin);
                        await saveUser(usersData, senderID, userData);
                        return message.reply("✅ PIN changed successfully!");
                    }
                    default:
                        return message.reply(
                            `💳 Card Commands:\n` +
                            `• card              — View card\n` +
                            `• card apply <type> — Apply (standard/gold/platinum)\n` +
                            `• card activate     — Activate card\n` +
                            `• card block        — Block card\n` +
                            `• card pin <4digits>— Change PIN`
                        );
                }
            }

            // ── SAVINGS ──────────────────────────────────────
            case "savings":
            case "save": {
                const savingsAction = args[1]?.toLowerCase();

                if (!savingsAction) {
                    return message.reply(
                        `🏧 𝗦𝗔𝗩𝗜𝗡𝗚𝗦 𝗔𝗖𝗖𝗢𝗨𝗡𝗧\n━━━━━━━━━━━━━━━━━\n` +
                        `💎 Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.savings || 0)}\n` +
                        `📈 Interest: ${INTEREST_RATE * 100}% daily\n` +
                        `━━━━━━━━━━━━━━━━━\n` +
                        `• savings deposit <amount>\n• savings withdraw`
                    );
                }

                if (savingsAction === "deposit" || savingsAction === "dep") {
                    const amount = parseInt(args[2]);
                    if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                    if (bank.balance < amount)         return message.reply(getLang("insufficientBalance"));

                    bank.balance  -= amount;
                    bank.savings   = (bank.savings || 0) + amount;
                    bank.lastInterest = today();
                    bank.transactions.unshift({
                        transactionId: generateTransactionId(), type: "savings_deposit",
                        amount, newBalance: bank.balance, timestamp: now(), description: "To Savings"
                    });
                    await saveUser(usersData, senderID, userData);
                    return message.reply(
                        `✅ 𝗦𝗔𝗩𝗜𝗡𝗚𝗦 𝗗𝗘𝗣𝗢𝗦𝗜𝗧\n\n` +
                        `💎 Savings: ${CURRENCY_SYMBOL}${formatMoney(bank.savings)}\n` +
                        `💰 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}`
                    );
                }

                if (savingsAction === "withdraw" || savingsAction === "wd") {
                    if (!bank.savings || bank.savings <= 0) return message.reply("❌ No savings to withdraw!");
                    const principal = bank.savings;
                    let interest = 0;
                    if (bank.lastInterest) {
                        const days = moment().diff(moment(bank.lastInterest, "DD/MM/YYYY"), "days");
                        interest = Math.floor(principal * INTEREST_RATE * Math.max(days, 0));
                    }
                    const total = principal + interest;
                    bank.balance     += total;
                    bank.savings      = 0;
                    bank.lastInterest = null;
                    bank.transactions.unshift({
                        transactionId: generateTransactionId(), type: "savings_withdraw",
                        amount: total, newBalance: bank.balance, timestamp: now(),
                        description: `Savings + ${CURRENCY_SYMBOL}${formatMoney(interest)} interest`
                    });
                    await saveUser(usersData, senderID, userData);
                    return message.reply(
                        `✅ 𝗦𝗔𝗩𝗜𝗡𝗚𝗦 𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪𝗔𝗟\n\n` +
                        `💎 Principal: ${CURRENCY_SYMBOL}${formatMoney(principal)}\n` +
                        `📈 Interest: ${CURRENCY_SYMBOL}${formatMoney(interest)}\n` +
                        `💰 Total Added: ${CURRENCY_SYMBOL}${formatMoney(total)}\n` +
                        `💳 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}`
                    );
                }

                return message.reply("❌ Unknown savings command.\nUse: savings deposit <amount>  or  savings withdraw");
            }

            // ── LOAN ─────────────────────────────────────────
            case "loan": {
                const loanAction = args[1]?.toLowerCase();

                if (!loanAction) {
                    return message.reply(
                        `🏦 𝗟𝗢𝗔𝗡 𝗦𝗘𝗥𝗩𝗜𝗖𝗘𝗦\n━━━━━━━━━━━━━━━━━\n` +
                        `📈 Interest Rate: ${LOAN_INTEREST_RATE * 100}% daily\n` +
                        `💰 Max Loan: ${CURRENCY_SYMBOL}${formatMoney(MAX_LOAN)}\n` +
                        `💵 Min Loan: ${CURRENCY_SYMBOL}${formatMoney(MIN_LOAN)}\n` +
                        `━━━━━━━━━━━━━━━━━\n` +
                        `• loan take <amount>   — Borrow money\n` +
                        `• loan repay <amount>  — Repay loan\n` +
                        `• loan info            — Loan details`
                    );
                }

                // ── LOAN INFO ────────────────────────────────
                if (loanAction === "info") {
                    if (!bank.loan || bank.loan.remaining <= 0) {
                        return message.reply(
                            `🏦 𝗟𝗢𝗔𝗡 𝗜𝗡𝗙𝗢\n━━━━━━━━━━━━━━━━━\n` +
                            `✅ No active loan.\n\n` +
                            `Max loan: ${CURRENCY_SYMBOL}${formatMoney(MAX_LOAN)}\n` +
                            `Interest: ${LOAN_INTEREST_RATE * 100}% per day\n\n` +
                            `Use: +bank loan take <amount>`
                        );
                    }
                    return message.reply(
                        `🏦 𝗟𝗢𝗔𝗡 𝗜𝗡𝗙𝗢\n━━━━━━━━━━━━━━━━━\n` +
                        `💵 Original: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.amount)}\n` +
                        `🔴 Remaining: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.remaining)}\n` +
                        `📈 Interest Accrued: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.interestAccrued || 0)}\n` +
                        `📅 Taken: ${bank.loan.takenAt}\n` +
                        `⚠️ Rate: ${LOAN_INTEREST_RATE * 100}% daily\n` +
                        `━━━━━━━━━━━━━━━━━\n` +
                        `Use: +bank loan repay <amount>`
                    );
                }

                // ── LOAN TAKE ────────────────────────────────
                if (loanAction === "take") {
                    if (bank.loan?.remaining > 0) {
                        return message.reply(
                            `❌ You already have an active loan!\n\n` +
                            `🔴 Remaining: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.remaining)}\n` +
                            `Repay it first before taking a new loan.`
                        );
                    }
                    const amount = parseInt(args[2]);
                    if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                    if (amount < MIN_LOAN)  return message.reply(`❌ Minimum loan: ${CURRENCY_SYMBOL}${formatMoney(MIN_LOAN)}`);
                    if (amount > MAX_LOAN)  return message.reply(`❌ Maximum loan: ${CURRENCY_SYMBOL}${formatMoney(MAX_LOAN)}`);

                    bank.loan = {
                        amount,
                        remaining: amount,
                        takenAt: now(),
                        lastInterestDate: today(),
                        interestAccrued: 0
                    };

                    // Loan goes directly to bank balance
                    bank.balance += amount;
                    bank.transactions.unshift({
                        transactionId: generateTransactionId(), type: "loan_taken",
                        amount, newBalance: bank.balance, timestamp: now(),
                        description: `Loan disbursed`
                    });
                    await saveUser(usersData, senderID, userData);
                    return message.reply(
                        `✅ 𝗟𝗢𝗔𝗡 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗!\n━━━━━━━━━━━━━━━━━\n` +
                        `💵 Amount: ${CURRENCY_SYMBOL}${formatMoney(amount)}\n` +
                        `📈 Daily Interest: ${LOAN_INTEREST_RATE * 100}%\n` +
                        `💳 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}\n` +
                        `━━━━━━━━━━━━━━━━━\n` +
                        `⚠️ Repay with: +bank loan repay <amount>\n` +
                        `Interest grows daily — repay ASAP!`
                    );
                }

                // ── LOAN REPAY ───────────────────────────────
                if (loanAction === "repay") {
                    if (!bank.loan || bank.loan.remaining <= 0) {
                        return message.reply("✅ You have no active loan to repay!");
                    }
                    const amount = parseInt(args[2]);
                    if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                    if (bank.balance < amount)         return message.reply(getLang("insufficientBalance"));

                    const actualRepay = Math.min(amount, bank.loan.remaining);
                    bank.balance       -= actualRepay;
                    bank.loan.remaining -= actualRepay;

                    const fullyRepaid = bank.loan.remaining <= 0;
                    if (fullyRepaid) bank.loan = null;

                    bank.transactions.unshift({
                        transactionId: generateTransactionId(), type: "loan_repay",
                        amount: actualRepay, newBalance: bank.balance, timestamp: now(),
                        description: fullyRepaid ? "Loan fully repaid" : "Partial loan repayment"
                    });
                    await saveUser(usersData, senderID, userData);

                    if (fullyRepaid) {
                        return message.reply(
                            `🎉 𝗟𝗢𝗔𝗡 𝗙𝗨𝗟𝗟𝗬 𝗥𝗘𝗣𝗔𝗜𝗗!\n━━━━━━━━━━━━━━━━━\n` +
                            `✅ Your loan has been cleared!\n` +
                            `💰 Paid: ${CURRENCY_SYMBOL}${formatMoney(actualRepay)}\n` +
                            `💳 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}`
                        );
                    }
                    return message.reply(
                        `✅ 𝗟𝗢𝗔𝗡 𝗣𝗔𝗥𝗧𝗜𝗔𝗟𝗟𝗬 𝗥𝗘𝗣𝗔𝗜𝗗\n━━━━━━━━━━━━━━━━━\n` +
                        `💰 Paid: ${CURRENCY_SYMBOL}${formatMoney(actualRepay)}\n` +
                        `🔴 Still Owe: ${CURRENCY_SYMBOL}${formatMoney(bank.loan.remaining)}\n` +
                        `💳 Bank Balance: ${CURRENCY_SYMBOL}${formatMoney(bank.balance)}`
                    );
                }

                return message.reply("❌ Unknown loan command.\nUse: loan take | loan repay | loan info");
            }

            default:
                return message.reply(getLang("menu"));
        }
    }
};
>>>>>>> 9bbaa51 (update)
