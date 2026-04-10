<<<<<<< HEAD

module.exports = {
	config: {
		name: "premium",
		version: "2.4.50",
		author: "ST | Sheikh Tamim",
		countDown: 5,
		role: 0,
		description: "Premium system management - request for all users, manage for admins",
		category: "system",
		guide: {
			en: "   {pn} request [message]: Request premium access (available to all)"
				+ "\n   {pn} add <uid/@mention>: Add user to premium (admin only)"
				+ "\n   {pn} remove <uid/@mention>: Remove user from premium (admin only)"
				+ "\n   {pn} list: Show premium users list (admin only)"
				+ "\n   {pn} pending: Show pending premium requests (admin only)"
		}
	},

	langs: {
		en: {
			requestSent: "✅ Your premium request has been sent to admins!",
			requestExists: "⚠️ You already have a pending premium request!",
			alreadyPremium: "✅ You already have premium access!",
			noPermission: "❌ You don't have permission to use this command!",
			userNotFound: "❌ User not found!",
			addedPremium: "✅ User %1 (%2) has been added to premium!",
			removedPremium: "✅ User %1 (%2) has been removed from premium!",
			userNotPremium: "❌ User %1 (%2) is not a premium member!",
			noPremiumUsers: "📝 No premium users found!",
			premiumList: "🌟 Premium Users List (Page %1/%2):\n\n%3",
			noPendingRequests: "📝 No pending premium requests!",
			pendingRequests: "📋 Pending Premium Requests:\n\n%1",
			invalidPage: "❌ Invalid page number!",
			replyToRemove: "Reply with:\n• r <numbers>: Remove users (e.g., r 1 2 3)\n• p <number>: Change page",
			replyToManage: "Reply with:\n• a <numbers>: Approve requests (e.g., a 1 2 3)\n• d <numbers>: Deny requests (e.g., d 1 2 3)",
			requestApproved: "✅ Premium request approved for user %1!",
			requestDenied: "❌ Premium request denied for user %1!",
			invalidNumber: "❌ Invalid number!",
			requestNotFound: "❌ Request not found!"
		}
	},

	ST: async function({ message, args, event, usersData, getLang, api }) {
		const { senderID, threadID } = event;
		const { adminBot } = global.GoatBot.config;
		const isAdmin = adminBot.includes(senderID.toString()) || adminBot.includes(senderID);
		const action = args[0]?.toLowerCase();

		switch (action) {
			case "request": {
				const userData = await usersData.get(senderID);
				if (userData.premium) {
					return message.reply(getLang("alreadyPremium"));
				}

				const existingRequests = userData.premiumRequests || [];
				const existingRequest = existingRequests.find(req => req.userID === senderID);
				if (existingRequest) {
					return message.reply(getLang("requestExists"));
				}

				const requestMessage = args.slice(1).join(" ") || "No message provided";
				const newRequest = {
					userID: senderID,
					userName: userData.name,
					threadID: threadID,
					message: requestMessage,
					timestamp: Date.now()
				};

				existingRequests.push(newRequest);
				await usersData.set(senderID, existingRequests, "premiumRequests");

				message.reply(getLang("requestSent"));
				break;
			}

			case "add":
			case "a": {
				if (!isAdmin) {
					return message.reply(getLang("noPermission"));
				}

				let targetID;
				if (event.type === "message_reply") {
					targetID = event.messageReply.senderID;
				} else if (Object.keys(event.mentions).length > 0) {
					targetID = Object.keys(event.mentions)[0];
				} else if (args[1]) {
					targetID = args[1];
				} else {
					return message.SyntaxError();
				}

				try {
					const userData = await usersData.get(targetID);
					await usersData.set(targetID, true, "premium");
					message.reply(getLang("addedPremium", userData.name, targetID));
				} catch (error) {
					message.reply(getLang("userNotFound"));
				}
				break;
			}

			case "remove":
			case "r": {
				if (!isAdmin) {
					return message.reply(getLang("noPermission"));
				}

				let targetID;
				if (event.type === "message_reply") {
					targetID = event.messageReply.senderID;
				} else if (Object.keys(event.mentions).length > 0) {
					targetID = Object.keys(event.mentions)[0];
				} else if (args[1]) {
					targetID = args[1];
				} else {
					return message.SyntaxError();
				}

				try {
					const userData = await usersData.get(targetID);
					if (!userData.premium) {
						return message.reply(getLang("userNotPremium", userData.name, targetID));
					}
					await usersData.set(targetID, false, "premium");
					message.reply(getLang("removedPremium", userData.name, targetID));
				} catch (error) {
					message.reply(getLang("userNotFound"));
				}
				break;
			}

			case "list": {
				if (!isAdmin) {
					return message.reply(getLang("noPermission"));
				}

				const allUsers = await usersData.getAll();
				const premiumUsers = allUsers.filter(user => user.premium === true);

				if (premiumUsers.length === 0) {
					return message.reply(getLang("noPremiumUsers"));
				}

				const page = parseInt(args[1]) || 1;
				const itemsPerPage = 20;
				const totalPages = Math.ceil(premiumUsers.length / itemsPerPage);

				if (page < 1 || page > totalPages) {
					return message.reply(getLang("invalidPage"));
				}

				const startIndex = (page - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;
				const usersOnPage = premiumUsers.slice(startIndex, endIndex);

				let userList = "";
				usersOnPage.forEach((user, index) => {
					const serialNumber = startIndex + index + 1;
					userList += `${serialNumber}. ${user.name} (${user.userID})\n`;
				});

				const replyMessage = getLang("premiumList", page, totalPages, userList) + "\n\n" + getLang("replyToRemove");

				message.reply(replyMessage, (err, info) => {
					if (err) return;
					global.GoatBot.onReply.set(info.messageID, {
						commandName: "premium",
						messageID: info.messageID,
						author: senderID,
						type: "list",
						page: page,
						totalPages: totalPages,
						users: premiumUsers,
						startIndex: startIndex
					});
				});
				break;
			}

			case "pending": {
				if (!isAdmin) {
					return message.reply(getLang("noPermission"));
				}

				const allUsers = await usersData.getAll();
				const allRequests = [];
				
				for (const user of allUsers) {
					if (user.premiumRequests && user.premiumRequests.length > 0) {
						allRequests.push(...user.premiumRequests);
					}
				}

				if (allRequests.length === 0) {
					return message.reply(getLang("noPendingRequests"));
				}

				// Group requests by thread
				const requestsByThread = {};
				for (const request of allRequests) {
					if (!requestsByThread[request.threadID]) {
						requestsByThread[request.threadID] = [];
					}
					requestsByThread[request.threadID].push(request);
				}

				let requestList = "";
				let globalIndex = 1;
				
				for (const threadID in requestsByThread) {
					const requests = requestsByThread[threadID];
					
					// Get thread name
					let threadName = "Unknown Thread";
					try {
						const threadData = await api.getThreadInfo(threadID);
						threadName = threadData.threadName || threadData.name || `Group ${threadID}`;
					} catch (error) {
						try {
							const threadsData = global.db.threadsData;
							const dbThreadData = await threadsData.get(threadID);
							threadName = dbThreadData.threadName || `Group ${threadID}`;
						} catch (dbError) {
							threadName = `Group ${threadID}`;
						}
					}
					
					requestList += `${threadName}:\n`;
					
					for (const request of requests) {
						const date = new Date(request.timestamp).toLocaleDateString();
						requestList += `${globalIndex}/ ${request.userName} (${request.userID}) - ${request.message} . ${date}\n`;
						globalIndex++;
					}
					requestList += "\n";
				}

				const replyMessage = getLang("pendingRequests", requestList) + getLang("replyToManage");

				message.reply(replyMessage, (err, info) => {
					if (err) return;
					global.GoatBot.onReply.set(info.messageID, {
						commandName: "premium",
						messageID: info.messageID,
						author: senderID,
						type: "pending",
						requests: allRequests
					});
				});
				break;
			}

			default: {
				// If user provided an action but it's not "request" and they're not admin
				if (args[0] && !isAdmin) {
					return message.reply(getLang("noPermission"));
				}
				return message.SyntaxError();
			}
		}
	},

	onReply: async function({ message, event, Reply, usersData, getLang }) {
		const { senderID, body } = event;
		const { author, type } = Reply;

		if (author !== senderID) return;

		const { adminBot } = global.GoatBot.config;
		const isAdmin = adminBot.includes(senderID.toString()) || adminBot.includes(senderID);

		if (!isAdmin) {
			return message.reply(getLang("noPermission"));
		}

		const input = body.trim().toLowerCase().split(" ");
		const action = input[0];

		if (type === "list") {
			const { page, totalPages, users, startIndex } = Reply;

			if (action === "p") {
				const pageNumber = parseInt(input[1]);
				if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
					return message.reply(getLang("invalidPage"));
				}

				const newStartIndex = (pageNumber - 1) * 20;
				const newEndIndex = newStartIndex + 20;
				const usersOnPage = users.slice(newStartIndex, newEndIndex);

				let userList = "";
				usersOnPage.forEach((user, index) => {
					const serialNumber = newStartIndex + index + 1;
					userList += `${serialNumber}. ${user.name} (${user.userID})\n`;
				});

				const replyMessage = getLang("premiumList", pageNumber, totalPages, userList) + "\n\n" + getLang("replyToRemove");

				message.reply(replyMessage, (err, info) => {
					if (err) return;
					message.unsend(Reply.messageID);
					global.GoatBot.onReply.set(info.messageID, {
						commandName: "premium",
						messageID: info.messageID,
						author: senderID,
						type: "list",
						page: pageNumber,
						totalPages: totalPages,
						users: users,
						startIndex: newStartIndex
					});
				});
			} else if (action === "r") {
				const numbers = input.slice(1).map(n => parseInt(n)).filter(n => !isNaN(n));
				
				if (numbers.length === 0) {
					return message.reply(getLang("invalidNumber"));
				}

				let removedCount = 0;
				const removedUsers = [];

				for (const num of numbers) {
					const userIndex = num - 1;
					const globalIndex = startIndex + (userIndex % 20);
					const targetUser = users[globalIndex];

					if (targetUser) {
						await usersData.set(targetUser.userID, false, "premium");
						removedUsers.push(`${targetUser.name} (${targetUser.userID})`);
						removedCount++;
					}
				}

				if (removedCount > 0) {
					message.reply(`✅ Removed premium from ${removedCount} user(s):\n${removedUsers.join("\n")}`);
				}
				message.unsend(Reply.messageID);
			}
		} else if (type === "pending") {
			const { requests } = Reply;
			const numbers = input.slice(1).map(n => parseInt(n)).filter(n => !isNaN(n));

			if (action === "a") {
				if (numbers.length === 0) {
					return message.reply(getLang("invalidNumber"));
				}

				const invalidNumbers = numbers.filter(num => num < 1 || num > requests.length);
				if (invalidNumbers.length > 0) {
					return message.reply(getLang("invalidNumber"));
				}

				let approvedCount = 0;
				const approvedUsers = [];

				for (const num of numbers) {
					const request = requests[num - 1];
					if (request) {
						await usersData.set(request.userID, true, "premium");
						
						// Remove request from user's premiumRequests array
						const userData = await usersData.get(request.userID);
						const updatedRequests = (userData.premiumRequests || []).filter(req => req.timestamp !== request.timestamp);
						await usersData.set(request.userID, updatedRequests, "premiumRequests");
						
						approvedUsers.push(request.userName);
						approvedCount++;
					}
				}
				
				if (approvedCount > 0) {
					message.reply(`✅ Approved ${approvedCount} premium request(s):\n${approvedUsers.join(", ")}`);
				}
				message.unsend(Reply.messageID);
			} else if (action === "d") {
				if (numbers.length === 0) {
					return message.reply(getLang("invalidNumber"));
				}

				const invalidNumbers = numbers.filter(num => num < 1 || num > requests.length);
				if (invalidNumbers.length > 0) {
					return message.reply(getLang("invalidNumber"));
				}

				let deniedCount = 0;
				const deniedUsers = [];

				for (const num of numbers) {
					const request = requests[num - 1];
					if (request) {
						// Remove request from user's premiumRequests array
						const userData = await usersData.get(request.userID);
						const updatedRequests = (userData.premiumRequests || []).filter(req => req.timestamp !== request.timestamp);
						await usersData.set(request.userID, updatedRequests, "premiumRequests");
						
						deniedUsers.push(request.userName);
						deniedCount++;
					}
				}
				
				if (deniedCount > 0) {
					message.reply(`❌ Denied ${deniedCount} premium request(s):\n${deniedUsers.join(", ")}`);
				}
				message.unsend(Reply.messageID);
			}
		}
	}
};
=======
const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
        config: {
                name: "premium",
                aliases: ["prem"],
                version: "1.1",
                author: "NeoKEX",
                countDown: 5,
                role: 2,
                description: {
                        vi: "Thêm, xóa quyền premium user với thời gian",
                        en: "Add, remove premium user role with time duration"
                },
                category: "owner",
                guide: {
                        vi: '   {pn} [add | -a] <uid | @tag> [time]: Thêm quyền premium cho người dùng'
                                + '\n   Time: số ngày (1d), giờ (2h), phút (30m) hoặc permanent'
                                + '\n   Ví dụ: {pn} add @user 7d (7 ngày)'
                                + '\n   {pn} [remove | -r] <uid | @tag>: Xóa quyền premium của người dùng'
                                + '\n   {pn} [list | -l]: Liệt kê danh sách premium users'
                                + '\n   {pn} [check | -c] <uid | @tag>: Kiểm tra thời gian premium còn lại',
                        en: '   {pn} [add | -a] <uid | @tag> [time]: Add premium role for user'
                                + '\n   Time: days (1d), hours (2h), minutes (30m) or permanent'
                                + '\n   Example: {pn} add @user 7d (7 days)'
                                + '\n   {pn} [remove | -r] <uid | @tag>: Remove premium role of user'
                                + '\n   {pn} [list | -l]: List all premium users'
                                + '\n   {pn} [check | -c] <uid | @tag>: Check remaining premium time'
                }
        },

        langs: {
                vi: {
                        added: "✓ | Đã thêm quyền premium cho %1 người dùng:\n%2",
                        alreadyPremium: "\n⚠ | %1 người dùng đã có quyền premium từ trước rồi:\n%2",
                        missingIdAdd: "⚠ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền premium",
                        removed: "✓ | Đã xóa quyền premium của %1 người dùng:\n%2",
                        notPremium: "⚠ | %1 người dùng không có quyền premium:\n%2",
                        missingIdRemove: "⚠ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền premium",
                        listPremium: "★ | Danh sách premium users:\n%1",
                        premiumInfo: "✓ | Thông tin premium của %1:\n• Trạng thái: %2\n• Hết hạn: %3",
                        invalidTime: "⚠ | Định dạng thời gian không hợp lệ! Sử dụng: 1d (ngày), 2h (giờ), 30m (phút) hoặc permanent",
                        permanent: "Vĩnh viễn",
                        expires: "Còn %1",
                        expired: "Đã hết hạn"
                },
                en: {
                        added: "✓ | Added premium role for %1 users:\n%2",
                        alreadyPremium: "\n⚠ | %1 users already have premium role:\n%2",
                        missingIdAdd: "⚠ | Please enter ID or tag user to add premium role",
                        removed: "✓ | Removed premium role of %1 users:\n%2",
                        notPremium: "⚠ | %1 users don't have premium role:\n%2",
                        missingIdRemove: "⚠ | Please enter ID or tag user to remove premium role",
                        listPremium: "★ | List of premium users:\n%1",
                        premiumInfo: "✓ | Premium info for %1:\n• Status: %2\n• Expires: %3",
                        invalidTime: "⚠ | Invalid time format! Use: 1d (days), 2h (hours), 30m (minutes) or permanent",
                        permanent: "Permanent",
                        expires: "%1 remaining",
                        expired: "Expired"
                }
        },

        onStart: async function ({ message, args, usersData, event, getLang }) {
                if (!config.premiumUsers)
                        config.premiumUsers = [];

                const parseTime = (timeStr) => {
                        if (!timeStr || timeStr === "permanent") return null;
                        const match = timeStr.match(/^(\d+)([dhm])$/);
                        if (!match) return false;
                        const value = parseInt(match[1]);
                        const unit = match[2];
                        const multipliers = { m: 60000, h: 3600000, d: 86400000 };
                        return Date.now() + (value * multipliers[unit]);
                };

                const getTimeRemaining = (expireTime) => {
                        if (!expireTime) return getLang("permanent");
                        const remaining = expireTime - Date.now();
                        if (remaining <= 0) return getLang("expired");
                        const days = Math.floor(remaining / 86400000);
                        const hours = Math.floor((remaining % 86400000) / 3600000);
                        const minutes = Math.floor((remaining % 3600000) / 60000);
                        if (days > 0) return getLang("expires", `${days}d ${hours}h`);
                        if (hours > 0) return getLang("expires", `${hours}h ${minutes}m`);
                        return getLang("expires", `${minutes}m`);
                };

                switch (args[0]) {
                        case "add":
                        case "-a": {
                                if (args[1]) {
                                        let uids = [];
                                        let timeArg = null;
                                        
                                        if (Object.keys(event.mentions).length > 0) {
                                                uids = Object.keys(event.mentions);
                                                const lastArg = args[args.length - 1];
                                                if (!Object.keys(event.mentions).includes(lastArg) && lastArg.match(/^(\d+)([dhm])$/)) {
                                                        timeArg = lastArg;
                                                }
                                        }
                                        else if (event.messageReply) {
                                                uids.push(event.messageReply.senderID);
                                                timeArg = args[1];
                                        }
                                        else {
                                                uids = args.filter(arg => !isNaN(arg));
                                                const lastArg = args[args.length - 1];
                                                if (!uids.includes(lastArg) && lastArg.match(/^(\d+)([dhm])$/)) {
                                                        timeArg = lastArg;
                                                }
                                        }

                                        if (!timeArg || timeArg === "permanent") {
                                                timeArg = "permanent";
                                        }
                                        
                                        const expireTime = parseTime(timeArg);
                                        if (expireTime === false)
                                                return message.reply(getLang("invalidTime"));

                                        const notPremiumIds = [];
                                        const premiumIds = [];
                                        
                                        for (const uid of uids) {
                                                if (config.premiumUsers.includes(uid))
                                                        premiumIds.push(uid);
                                                else
                                                        notPremiumIds.push(uid);
                                        }

                                        config.premiumUsers.push(...notPremiumIds);
                                        
                                        for (const uid of notPremiumIds) {
                                                await usersData.set(uid, expireTime, "data.premiumExpireTime");
                                        }

                                        const getNames = await Promise.all(notPremiumIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                                        
                                        const timeInfo = expireTime ? getTimeRemaining(expireTime) : getLang("permanent");
                                        return message.reply(
                                                (notPremiumIds.length > 0 ? getLang("added", notPremiumIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid}) - ${timeInfo}`).join("\n")) : "")
                                                + (premiumIds.length > 0 ? getLang("alreadyPremium", premiumIds.length, premiumIds.map(uid => `• ${uid}`).join("\n")) : "")
                                        );
                                }
                                else
                                        return message.reply(getLang("missingIdAdd"));
                        }
                        case "remove":
                        case "-r": {
                                if (args[1]) {
                                        let uids = [];
                                        if (Object.keys(event.mentions).length > 0)
                                                uids = Object.keys(event.mentions);
                                        else if (event.messageReply)
                                                uids.push(event.messageReply.senderID);
                                        else
                                                uids = args.filter(arg => !isNaN(arg));
                                        
                                        const notPremiumIds = [];
                                        const premiumIds = [];
                                        
                                        for (const uid of uids) {
                                                if (config.premiumUsers.includes(uid))
                                                        premiumIds.push(uid);
                                                else
                                                        notPremiumIds.push(uid);
                                        }
                                        
                                        for (const uid of premiumIds) {
                                                config.premiumUsers.splice(config.premiumUsers.indexOf(uid), 1);
                                                await usersData.set(uid, null, "data.premiumExpireTime");
                                        }
                                        
                                        const getNames = await Promise.all(premiumIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                                        return message.reply(
                                                (premiumIds.length > 0 ? getLang("removed", premiumIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
                                                + (notPremiumIds.length > 0 ? getLang("notPremium", notPremiumIds.length, notPremiumIds.map(uid => `• ${uid}`).join("\n")) : "")
                                        );
                                }
                                else
                                        return message.reply(getLang("missingIdRemove"));
                        }
                        case "list":
                        case "-l": {
                                const premiumList = await Promise.all(config.premiumUsers.map(async uid => {
                                        const name = await usersData.getName(uid);
                                        const expireTime = await usersData.get(uid, "data.premiumExpireTime");
                                        const timeInfo = getTimeRemaining(expireTime);
                                        return `• ${name} (${uid}) - ${timeInfo}`;
                                }));
                                return message.reply(getLang("listPremium", premiumList.join("\n")));
                        }
                        case "check":
                        case "-c": {
                                let uid;
                                if (Object.keys(event.mentions).length > 0)
                                        uid = Object.keys(event.mentions)[0];
                                else if (event.messageReply)
                                        uid = event.messageReply.senderID;
                                else if (args[1] && !isNaN(args[1]))
                                        uid = args[1];
                                else
                                        uid = event.senderID;

                                const name = await usersData.getName(uid);
                                const isPremium = config.premiumUsers.includes(uid);
                                const expireTime = await usersData.get(uid, "data.premiumExpireTime");
                                const status = isPremium ? "Premium" : "Not Premium";
                                const timeInfo = isPremium ? getTimeRemaining(expireTime) : "N/A";
                                
                                return message.reply(getLang("premiumInfo", name, status, timeInfo));
                        }
                        default:
                                return message.SyntaxError();
                }
        }
};
>>>>>>> 9bbaa51 (update)
