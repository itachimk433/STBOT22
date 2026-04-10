module.exports = function (sequelize) {
<<<<<<< HEAD
	const { Model, DataTypes } = require("sequelize");
	class userModel extends Model { }
	userModel.init({
		userID: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.INTEGER,
		vanity: DataTypes.STRING,
		exp: {
			type: DataTypes.BIGINT,
			defaultValue: 0
		},
		money: {
			type: DataTypes.BIGINT,
			defaultValue: 0
		},
		banned: {
			type: DataTypes.JSON,
			defaultValue: {}
		},
		settings: {
			type: DataTypes.JSON,
			defaultValue: {}
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {}
		},
		premium: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		premiumRequests: {
			type: DataTypes.JSON,
			defaultValue: []
		}
	}, {
		sequelize,
		modelName: "user"
	});

	return userModel;
=======
        const { Model, DataTypes } = require("sequelize");
        class userModel extends Model { }
        userModel.init({
                userID: {
                        type: DataTypes.STRING,
                        primaryKey: true
                },
                name: DataTypes.STRING,
                gender: DataTypes.STRING,
                vanity: DataTypes.STRING,
                exp: {
                        type: DataTypes.BIGINT,
                        defaultValue: 0
                },
                money: {
                        type: DataTypes.BIGINT,
                        defaultValue: 0
                },
                banned: {
                        type: DataTypes.JSON,
                        defaultValue: {}
                },
                settings: {
                        type: DataTypes.JSON,
                        defaultValue: {}
                },
                data: {
                        type: DataTypes.JSON,
                        defaultValue: {}
                }
        }, {
                sequelize,
                modelName: "user"
        });

        return userModel;
>>>>>>> 9bbaa51 (update)
};