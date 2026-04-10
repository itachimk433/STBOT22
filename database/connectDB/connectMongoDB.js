module.exports = async function (uriConnect) {
<<<<<<< HEAD
	const mongoose = require("mongoose");

	// Fix deprecation warning
	mongoose.set('strictQuery', false);

	const threadModel = require("../models/mongodb/thread.js");
	const userModel = require("../models/mongodb/user.js");
	const dashBoardModel = require("../models/mongodb/userDashBoard.js");
	const globalModel = require("../models/mongodb/global.js");
	const bankModel = require("../models/mongodb/bank.js");
	const staiHistoryModel = require("../models/mongodb/staiHistory.js");

	await mongoose.connect(uriConnect, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	return {
		threadModel,
		userModel,
		dashBoardModel,
		globalModel,
		bankModel,
		staiHistoryModel
	};
=======
				const mongoose = require("mongoose");

				const threadModel = require("../models/mongodb/thread.js");
				const userModel = require("../models/mongodb/user.js");
				const dashBoardModel = require("../models/mongodb/userDashBoard.js");
				const globalModel = require("../models/mongodb/global.js");

				await mongoose.connect(uriConnect);

				return {
								threadModel,
								userModel,
								dashBoardModel,
								globalModel
				};
>>>>>>> 9bbaa51 (update)
};