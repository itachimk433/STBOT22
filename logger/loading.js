const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '';
<<<<<<< HEAD
const getCurrentTime = () => colors.gray(moment().tz('Asia/Dhaka').format('HH:mm:ss DD/MM/YYYY'));
=======
const getCurrentTime = () => colors.gray(moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY'));
>>>>>>> 9bbaa51 (update)

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	process.stderr.write(`\r${`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)} ${message}`}`);
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	succes: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "SUCCES";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)} ${message}`}`);
	}
};