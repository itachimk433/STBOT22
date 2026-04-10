const mongoose = require("mongoose");
const { Schema } = mongoose;

const threadModel = new Schema({
	threadID: {
		type: String,
		unique: true
	},
	threadName: String,
	threadThemeID: String,
	emoji: String,
	adminIDs: {
		type: Array,
		default: []
	},
	imageSrc: String,
	approvalMode: Boolean,
	members: {
		type: Array,
		default: []
	},
	banned: {
		type: Object,
		default: {}
	},
	settings: {
		type: Object,
		default: {}
	},
	data: {
		type: Object,
		default: {}
	},
<<<<<<< HEAD
	isGroup: Boolean,
	approved: {
		type: Boolean,
		default: true
	}
=======
	isGroup: Boolean
>>>>>>> 9bbaa51 (update)
}, {
	timestamps: true,
	minimize: false
});

module.exports = mongoose.model("threads", threadModel);