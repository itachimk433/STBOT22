module.exports = async function () {
	const { Sequelize } = require("sequelize");
	const path = __dirname + "/../data/data.sqlite";
	const sequelize = new Sequelize({
		dialect: "sqlite",
		host: path,
		logging: false
	});

	const threadModel = require("../models/sqlite/thread.js")(sequelize);
	const userModel = require("../models/sqlite/user.js")(sequelize);
	const dashBoardModel = require("../models/sqlite/userDashBoard.js")(sequelize);
	const globalModel = require("../models/sqlite/global.js")(sequelize);
<<<<<<< HEAD
	const bankModel = require("../models/sqlite/bank.js")(sequelize);
	const staiHistoryModel = require("../models/sqlite/staiHistory.js")(sequelize);
=======
>>>>>>> 9bbaa51 (update)

	await sequelize.sync({ force: false });

	return {
		threadModel,
		userModel,
		dashBoardModel,
		globalModel,
<<<<<<< HEAD
		bankModel,
		staiHistoryModel,
=======
>>>>>>> 9bbaa51 (update)
		sequelize
	};
};