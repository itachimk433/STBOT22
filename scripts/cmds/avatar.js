const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "avatar",
<<<<<<< HEAD
		author: "NTKhang",
=======
		author: "James Dahao",
>>>>>>> 9bbaa51 (update)
		version: "1.6",
		cooldowns: 5,
		role: 0,
		description: {
<<<<<<< HEAD
			vi: "tạo avatar anime với chữ ký",
			en: "create anime avatar with signature"
		},
		category: "image",
		guide: {
			vi: "   {p}{n} <mã số nhân vật hoặc tên nhân vật> | <chữ nền> | <chữ ký> | <tên màu tiếng anh hoặc mã màu nền (hex color)>"
				+ "\n   {p}{n} help: xem cách dùng lệnh",
			en: "   {p}{n} <character id or character name> | <background text> | <signature> | <background color name or hex color>"
				+ "\n   {p}{n} help: view how to use this command"
=======
			en: "Create an anime avatar with a signature"
		},
		category: "image",
		guide: {
			en: "   {p}{n} <character id or name> | <background text> | <signature> | <background color name or hex color>\n   {p}{n} help: view command usage"
>>>>>>> 9bbaa51 (update)
		}
	},

	langs: {
<<<<<<< HEAD
		vi: {
			initImage: "Đang khởi tạo hình ảnh, vui lòng chờ đợi...",
			invalidCharacter: "Hiện tại chỉ có %1 nhân vật trên hệ thống, vui lòng nhập id nhân vật nhỏ hơn",
			notFoundCharacter: "Không tìm thấy nhân vật mang tên %1 trong danh sách nhân vật",
			errorGetCharacter: "Đã xảy ra lỗi lấy dữ liệu nhân vật:\n%1: %2",
			success: "✅ Avatar của bạn\nNhân vật: %1\nMã số: %2\nChữ nền: %3\nChữ ký: %4\nMàu: %5",
			defaultColor: "mặc định",
			error: "Đã xảy ra lỗi\n%1: %2"
		},
		en: {
			initImage: "Initializing image, please wait...",
			invalidCharacter: "Currently there are only %1 characters on the system, please enter a character id less than",
			notFoundCharacter: "No character named %1 was found in the character list",
			errorGetCharacter: "An error occurred while getting character data:\n%1: %2",
=======
		en: {
			initImage: "Initializing image, please wait...",
			invalidCharacter: "Currently there are only %1 characters in the system, please enter an id less than that",
			notFoundCharacter: "No character named %1 was found",
			errorGetCharacter: "An error occurred while fetching character data:\n%1: %2",
>>>>>>> 9bbaa51 (update)
			success: "✅ Your avatar\nCharacter: %1\nID: %2\nBackground text: %3\nSignature: %4\nColor: %5",
			defaultColor: "default",
			error: "An error occurred\n%1: %2"
		}
	},

	onStart: async function ({ args, message, getLang }) {
<<<<<<< HEAD
		const content = args.join(" ").split("|").map(item => item = item.trim());
		let idNhanVat, tenNhanvat;
		const chu_Nen = content[1];
		const chu_Ky = content[2];
=======
		const content = args.join(" ").split("|").map(item => item.trim());
		let characterId, characterName;
		const backgroundText = content[1];
		const signature = content[2];
>>>>>>> 9bbaa51 (update)
		const colorBg = content[3];
		if (!args[0])
			return message.SyntaxError();
		message.reply(getLang("initImage"));
		try {
<<<<<<< HEAD
			const dataChracter = (await axios.get("https://goatbotserver.onrender.com/taoanhdep/listavataranime?apikey=ntkhang")).data.data;
			if (!isNaN(content[0])) {
				idNhanVat = parseInt(content[0]);
				const totalCharacter = dataChracter.length - 1;
				if (idNhanVat > totalCharacter)
					return message.reply(getLang("invalidCharacter", totalCharacter));
				tenNhanvat = dataChracter[idNhanVat].name;
			}
			else {
				const findChracter = dataChracter.find(item => item.name.toLowerCase() == content[0].toLowerCase());
				if (findChracter) {
					idNhanVat = findChracter.stt;
					tenNhanvat = content[0];
				}
				else
					return message.reply(getLang("notFoundCharacter", content[0]));
			}
		}
		catch (error) {
=======
			const dataCharacter = (await axios.get("https://goatbotserver.onrender.com/taoanhdep/listavataranime?apikey=ntkhang")).data.data;
			if (!isNaN(content[0])) {
				characterId = parseInt(content[0]);
				const totalCharacter = dataCharacter.length - 1;
				if (characterId > totalCharacter)
					return message.reply(getLang("invalidCharacter", totalCharacter));
				characterName = dataCharacter[characterId].name;
			} else {
				const foundCharacter = dataCharacter.find(item => item.name.toLowerCase() == content[0].toLowerCase());
				if (foundCharacter) {
					characterId = foundCharacter.stt;
					characterName = content[0];
				} else
					return message.reply(getLang("notFoundCharacter", content[0]));
			}
		} catch (error) {
>>>>>>> 9bbaa51 (update)
			const err = error.response.data;
			return message.reply(getLang("errorGetCharacter", err.error, err.message));
		}

		const endpoint = `https://goatbotserver.onrender.com/taoanhdep/avataranime`;
		const params = {
<<<<<<< HEAD
			id: idNhanVat,
			chu_Nen,
			chu_Ky,
=======
			id: characterId,
			chu_Nen: backgroundText,
			chu_Ky: signature,
>>>>>>> 9bbaa51 (update)
			apikey: "ntkhangGoatBot"
		};
		if (colorBg)
			params.colorBg = colorBg;

		try {
			const avatarImage = await getStreamFromURL(endpoint, "avatar.png", { params });
			message.reply({
<<<<<<< HEAD
				body: getLang("success", tenNhanvat, idNhanVat, chu_Nen, chu_Ky, colorBg || getLang("defaultColor")),
				attachment: avatarImage
			});
		}
		catch (error) {
=======
				body: getLang("success", characterName, characterId, backgroundText, signature, colorBg || getLang("defaultColor")),
				attachment: avatarImage
			});
		} catch (error) {
>>>>>>> 9bbaa51 (update)
			error.response.data.on("data", function (e) {
				const err = JSON.parse(e);
				message.reply(getLang("error", err.error, err.message));
			});
		}
	}
<<<<<<< HEAD
};
=======
};
>>>>>>> 9bbaa51 (update)
