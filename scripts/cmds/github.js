<<<<<<< HEAD

const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "github",
    aliases: [],
    version: "2.4.75",
    author: "ST",
    countDown: 5,
    role: 2,
    description: "Manage GitHub repository synchronization",
    category: "owner",
    guide: {
      en: "   {pn} status - Check GitHub sync status\n"
        + "   {pn} test - Test GitHub connection\n"
        + "   {pn} sync - Sync entire project to GitHub\n"
        + "   {pn} enable - Enable auto-sync\n"
        + "   {pn} disable - Disable auto-sync\n"
        + "   {pn} upload <file> - Upload specific file"
    }
  },

  ST: async function({ args, message, api }) {
    const githubSync = global.utils.getGitHubSync();
    
    if (!githubSync) {
      return message.reply("❌ GitHub integration is not configured. Please set up in config.json");
    }

    const action = (args[0] || "").toLowerCase();

    switch (action) {
      case "status": {
        const status = githubSync.enabled ? "✅ Enabled" : "❌ Disabled";
        const initialized = githubSync.initialized ? "✅ Yes" : "❌ No";
        const repo = `${githubSync.owner}/${githubSync.repo}`;
        const branch = githubSync.branch;
        const autoSync = githubSync.autoCommit ? "✅ On" : "❌ Off";
        const autoSyncOnUpdate = global.GoatBot.config.githubIntegration?.autoSyncOnUpdate ? "✅ On" : "❌ Off";
        
        return message.reply(
          `📊 GitHub Integration Status\n\n` +
          `Status: ${status}\n` +
          `Initialized: ${initialized}\n` +
          `Repository: ${repo}\n` +
          `Branch: ${branch}\n` +
          `Auto-commit: ${autoSync}\n` +
          `Auto-sync on update: ${autoSyncOnUpdate}\n` +
          `Queue: ${githubSync.queue.length} pending\n\n` +
          `💡 Use 'github test' to verify connection`
        );
      }

      case "test": {
        const result = await githubSync.testConnection();
        return message.reply(
          result.success
            ? `✅ Connection successful!\nRepository: ${githubSync.owner}/${githubSync.repo}`
            : `❌ Connection failed: ${result.message}`
        );
      }

      case "sync": {
        message.reply("🔄 Starting full project sync...");
        const result = await githubSync.syncProject();
        
        if (result.success) {
          const successCount = result.results.filter(r => r.success).length;
          const failCount = result.results.filter(r => !r.success).length;
          
          return message.reply(
            `✅ Project sync completed!\n` +
            `Success: ${successCount}\n` +
            `Failed: ${failCount}`
          );
        } else {
          return message.reply(`❌ Sync failed: ${result.message}`);
        }
      }

      case "enable": {
        githubSync.enabled = true;
        githubSync.autoCommit = true;
        
        const configPath = path.join(process.cwd(), "config.json");
        const config = require(configPath);
        delete require.cache[require.resolve(configPath)];
        config.githubIntegration.enable = true;
        config.githubIntegration.autoCommit = true;
        config.githubIntegration.autoSyncOnUpdate = true;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        return message.reply("✅ GitHub auto-sync enabled\n📦 Auto-sync on updates: enabled");
      }

      case "disable": {
        githubSync.enabled = false;
        githubSync.autoCommit = false;
        
        const configPath = path.join(process.cwd(), "config.json");
        const config = require(configPath);
        delete require.cache[require.resolve(configPath)];
        config.githubIntegration.enable = false;
        config.githubIntegration.autoCommit = false;
        config.githubIntegration.autoSyncOnUpdate = false;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        return message.reply("❌ GitHub auto-sync disabled\n📦 Auto-sync on updates: disabled");
      }

      case "upload": {
        if (!args[1]) {
          return message.reply("❌ Please specify a file path");
        }

        const filePath = args.slice(1).join(" ");
        const fullPath = path.join(process.cwd(), filePath);
        
        if (!fs.existsSync(fullPath)) {
          return message.reply(`❌ File not found: ${filePath}`);
        }

        const result = await githubSync.syncFile("upload", fullPath);
        return message.reply(
          result.success
            ? `✅ File uploaded: ${filePath}`
            : `❌ Upload failed: ${result.message}`
        );
      }

      default:
        return message.reply(
          "📚 GitHub Commands:\n\n" +
          "• status - Check sync status\n" +
          "• test - Test connection\n" +
          "• sync - Sync entire project\n" +
          "• enable - Enable auto-sync\n" +
          "• disable - Disable auto-sync\n" +
          "• upload <file> - Upload file"
        );
    }
=======
module.exports = {
  config: {
    name: "github",
    aliases: ["git", "botgithub"],
    version: "1.0",
    author: "Charles MK",
    countDown: 3,
    role: 2,
    longDescription: "Returns the link the bot's github.",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = "✓ | Here is the bot's Github link:\n\nhttps://github.com/BaneleMK12/C.MK-MESSENGER-BOT\n\n";

    message.reply(text);
>>>>>>> 9bbaa51 (update)
  }
};
