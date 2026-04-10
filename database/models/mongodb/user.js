const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema({
<<<<<<< HEAD
	userID: {
		type: String,
		unique: true
	},
	name: String,
	gender: Number,
	vanity: String,
	exp: {
		type: Number,
		default: 0
	},
	money: {
		type: Number,
		default: 0
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
	premium: {
		type: Boolean,
		default: false
	},
	premiumRequests: {
		type: Array,
		default: []
	}
}, {
	timestamps: true,
	minimize: false
=======
        userID: {
                type: String,
                unique: true
        },
        name: String,
        gender: String,
        vanity: String,
        exp: {
                type: Number,
                default: 0
        },
        money: {
                type: Number,
                default: 0
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
        }
}, {
        timestamps: true,
        minimize: false
>>>>>>> 9bbaa51 (update)
});

module.exports = mongoose.model("users", userModel);