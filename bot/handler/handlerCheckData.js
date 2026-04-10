const { db, utils, GoatBot } = global;
const { config } = GoatBot;
const { log, getText } = utils;
const { creatingThreadData, creatingUserData } = global.client.database;

module.exports = async function (usersData, threadsData, event) {
	const { threadID } = event;
	const senderID = event.senderID || event.author || event.userID;

	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID) {
		try {
<<<<<<< HEAD
			if (global.temp.createThreadDataError.includes(threadID))
=======
			if (global.temp.createThreadDataError.has(threadID))
>>>>>>> 9bbaa51 (update)
				return;

			const findInCreatingThreadData = creatingThreadData.find(t => t.threadID == threadID);
			if (!findInCreatingThreadData) {
				if (global.db.allThreadData.some(t => t.threadID == threadID))
					return;

				const threadData = await threadsData.create(threadID);
				log.info("DATABASE", `New Thread: ${threadID} | ${threadData.threadName} | ${config.database.type}`);
			}
			else {
				await findInCreatingThreadData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
<<<<<<< HEAD
				global.temp.createThreadDataError.push(threadID);
=======
				global.temp.createThreadDataError.add(threadID);
>>>>>>> 9bbaa51 (update)
				log.err("DATABASE", getText("handlerCheckData", "cantCreateThread", threadID), err);
			}
		}
	}


	// ————————————— CHECK USER DATA ————————————— //
	if (senderID) {
<<<<<<< HEAD
		// Skip userID 0 (unreact events from Facebook API)
		if (senderID === 0 || senderID === '0') {
			return;
		}
		
=======
>>>>>>> 9bbaa51 (update)
		try {
			const findInCreatingUserData = creatingUserData.find(u => u.userID == senderID);
			if (!findInCreatingUserData) {
				if (db.allUserData.some(u => u.userID == senderID))
					return;

				const userData = await usersData.create(senderID);
				log.info("DATABASE", `New User: ${senderID} | ${userData.name} | ${config.database.type}`);
			}
			else {
				await findInCreatingUserData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS")
				log.err("DATABASE", getText("handlerCheckData", "cantCreateUser", senderID), err);
		}
	}
};