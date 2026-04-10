<<<<<<< HEAD

const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
	config: {
		name: "shell",
		aliases: ["sh", "terminal", "cmd"],
		version: "1.0",
		author: "ST | Sheikh Tamim",
		countDown: 3,
		role: 2, 
		shortDescription: "Execute shell commands",
		longDescription: "Execute shell/terminal commands like file operations, package installation, etc.\n\nBasic Usage Guide:\n• File Operations: ls, cat, touch, mkdir, rm\n• Package Install: npm install <package>\n• Create Files: echo 'content' > file.txt\n• View Files: cat filename.txt\n• Directory: cd, pwd, ls -la\n• System Info: whoami, date, uptime",
		category: "owner",
		guide: "{pn} <command>\nExamples:\n{pn} ls -la\n{pn} npm install axios\n{pn} touch newfile.txt\n{pn} echo 'Hello World' > test.txt\n{pn} cat package.json\n{pn} mkdir newfolder"
	},

	onStart: async function ({ message, args, event, api }) {
		const { threadID, senderID, messageID } = event;
		
		
		const botAdmins = global.GoatBot.config?.adminBot || [];
		if (!botAdmins.includes(senderID)) {
			return api.sendMessage("⛔ You are not authorized to use this command.", threadID, messageID);
		}

		if (!args[0]) {
			return api.sendMessage("⚠️ Please provide a shell command to execute.\nExample: /shell ls -la", threadID, messageID);
		}

		const command = args.join(' ');

		try {
			exec(command, { timeout: 30000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
				let response = '';

				if (error) {
					response = `❌ Command Failed\n📝 Command: \`${command}\`\n\n💥 Error:\n\`\`\`\n${error.message}\n\`\`\``;
				} else {
					response = `✅ Command Executed Successfully\n📝 Command: \`${command}\`\n\n`;
					
					if (stdout) {
						response += `📤 Output:\n\`\`\`\n${stdout}\n\`\`\``;
					}
					if (stderr) {
						response += `⚠️ Warning/Info:\n\`\`\`\n${stderr}\n\`\`\``;
					}
					if (!stdout && !stderr) {
						response += `✨ Command executed successfully with no output.`;
					}
				}

				// If response is too long, truncate it
				if (response.length > 2000) {
					response = response.substring(0, 1900) + "\n\n... (output truncated)";
				}

				api.sendMessage(response, threadID, messageID);
			});

		} catch (err) {
			api.sendMessage(`❌ Failed to execute command: ${err.message}`, threadID, messageID);
		}
	}
};
=======
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

module.exports = {
        config: {
                name: "shell",
                aliases: ["sh", "cmd", "exec"],
                version: "1.0",
                author: "NeoKEX",
                countDown: 5,
                role: 4,
                description: {
                        vi: "Thực thi lệnh shell",
                        en: "Execute shell commands"
                },
                category: "owner",
                guide: {
                        vi: '   {pn} <command>: Thực thi lệnh shell'
                                + '\n   Ví dụ: {pn} ls -la'
                                + '\n   {pn} node -v',
                        en: '   {pn} <command>: Execute shell command'
                                + '\n   Example: {pn} ls -la'
                                + '\n   {pn} node -v'
                }
        },

        langs: {
                vi: {
                        missingCommand: "⚠ | Vui lòng nhập lệnh shell cần thực thi",
                        executing: "⚙ | Đang thực thi lệnh...",
                        output: "✓ | Kết quả:\n\n%1",
                        error: "✗ | Lỗi:\n\n%1",
                        timeout: "⚠ | Lệnh thực thi quá lâu (timeout 30s)"
                },
                en: {
                        missingCommand: "⚠ | Please enter shell command to execute",
                        executing: "⚙ | Executing command...",
                        output: "✓ | Output:\n\n%1",
                        error: "✗ | Error:\n\n%1",
                        timeout: "⚠ | Command execution timeout (30s)"
                }
        },

        onStart: async function ({ message, args, event, getLang, api }) {
                const command = args.join(" ");
                if (!command)
                        return message.reply(getLang("missingCommand"));

                await message.reply(getLang("executing"));

                try {
                        const { stdout, stderr } = await execPromise(command, {
                                timeout: 30000,
                                maxBuffer: 1024 * 1024 * 10
                        });

                        let output = "";
                        if (stdout) output += stdout;
                        if (stderr) output += stderr;

                        if (!output) output = "Command executed successfully (no output)";

                        if (output.length > 2000) {
                                output = output.substring(0, 1997) + "...";
                        }

                        return message.reply(getLang("output", output));
                } catch (error) {
                        let errorMsg = error.message;
                        if (errorMsg.includes("ETIMEDOUT") || errorMsg.includes("timeout"))
                                return message.reply(getLang("timeout"));

                        if (errorMsg.length > 2000) {
                                errorMsg = errorMsg.substring(0, 1997) + "...";
                        }

                        return message.reply(getLang("error", errorMsg));
                }
        }
};
>>>>>>> 9bbaa51 (update)
