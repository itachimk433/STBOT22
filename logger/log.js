const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '';
<<<<<<< HEAD
const getCurrentTime = () => colors.gray(moment().tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY"));
=======
const getCurrentTime = () => colors.gray(moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"));
>>>>>>> 9bbaa51 (update)

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
<<<<<<< HEAD
	const logMessage = `${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)} ${message}`;
	console.log(logMessage);

	// Send to dashboard if available
	if (global.dashboardLogStream) {
		global.dashboardLogStream(`[ERROR] ${prefix}: ${message}`);
	}

=======
	console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)}`, message);
>>>>>>> 9bbaa51 (update)
	const error = Object.values(arguments).slice(2);
	for (let err of error) {
		if (typeof err == "object" && !err.stack)
			err = JSON.stringify(err, null, 2);
		console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)}`, err);
<<<<<<< HEAD
		if (global.dashboardLogStream) {
			global.dashboardLogStream(`[ERROR] ${err}`);
		}
=======
>>>>>>> 9bbaa51 (update)
	}
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		console.log(`${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)}`, message);
<<<<<<< HEAD
		if (global.dashboardLogStream) {
			global.dashboardLogStream(`[WARN] ${prefix}: ${message}`);
		}
=======
>>>>>>> 9bbaa51 (update)
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		console.log(`${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)}`, message);
<<<<<<< HEAD
		if (global.dashboardLogStream) {
			global.dashboardLogStream(`[INFO] ${prefix}: ${message}`);
		}
=======
>>>>>>> 9bbaa51 (update)
	},
	success: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "SUCCES";
		}
		console.log(`${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)}`, message);
<<<<<<< HEAD
		if (global.dashboardLogStream) {
			global.dashboardLogStream(`[SUCCESS] ${prefix}: ${message}`);
		}
=======
>>>>>>> 9bbaa51 (update)
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		console.log(`${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)}`, message);
<<<<<<< HEAD
		if (global.dashboardLogStream) {
			global.dashboardLogStream(`[MASTER] ${prefix}: ${message}`);
		}
	},
	dev: (...args) => {
=======
	},
	dev: (...args) => {
		if (["development", "production"].includes(process.env.NODE_ENV) == false)
			return;
>>>>>>> 9bbaa51 (update)
		try {
			throw new Error();
		}
		catch (err) {
			const at = err.stack.split('\n')[2];
			let position = at.slice(at.indexOf(process.cwd()) + process.cwd().length + 1);
			position.endsWith(')') ? position = position.slice(0, -1) : null;
			console.log(`\x1b[36m${position} =>\x1b[0m`, ...args);
<<<<<<< HEAD
			if (global.dashboardLogStream) {
				global.dashboardLogStream(`[DEV] ${position} => ${args.join(' ')}`);
			}
=======
>>>>>>> 9bbaa51 (update)
		}
	}
};