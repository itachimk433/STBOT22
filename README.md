<div align="center">
<<<<<<< HEAD

# 🐐 ST-BOT - By Sheikh Tamim

<img src="./dashboard/images/st.png" alt="ST-Bot Logo" width="200" height="200" style="border-radius: 50%;">

*A customized and powerful multi-purpose chatbot framework for Facebook Messenger*

![GitHub stars](https://img.shields.io/github/stars/sheikhtamimlover/ST-BOT?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/sheikhtamimlover/ST-BOT?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/sheikhtamimlover/ST-BOT?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/sheikhtamimlover/ST-BOT?style=for-the-badge)
![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)
![Package Version](https://img.shields.io/github/package-json/v/sheikhtamimlover/ST-BOT?style=for-the-badge)
![Repository Size](https://img.shields.io/github/repo-size/sheikhtamimlover/ST-BOT?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/sheikhtamimlover/ST-BOT?style=for-the-badge)
[![Deploy on Render](https://img.shields.io/badge/Deploy%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://replit.com/github/sheikhtamimlover/ST-BOT)
[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=sheikhtamimlover.ST-BOT)](https://github.com/sheikhtamimlover/ST-BOT)

**Enhanced version of GoatBot V2** - Modified and maintained by **Sheikh Tamim**

[![Instagram](https://img.shields.io/badge/Instagram-@sheikh.tamim__lover-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/sheikh.tamim_lover/)
[![GitHub](https://img.shields.io/badge/GitHub-sheikhtamimlover-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sheikhtamimlover)

---

### 🎬 Tutorial Video

[![Watch Tutorial on YouTube](https://img.shields.io/badge/Watch%20Tutorial-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/8rmZLxJWLX8)

[![YouTube Tutorial](https://img.youtube.com/vi/8rmZLxJWLX8/maxresdefault.jpg)](https://youtu.be/8rmZLxJWLX8)

---

</div>

## 📖 Table of Contents

- [Features](#-features)
- [Command Structure](#-command-structure)
- [Configuration Guide](#-configuration-guide)
- [Installation & Setup](#-installation--setup)
- [Premium System](#-premium-system)
- [ST-FCA (Custom Facebook API)](#-st-fca-custom-facebook-api)
- [Advanced Features](#-advanced-features)
- [Dashboard](#-dashboard)
- [ST Handlers Store](#-st-handlers-store)
- [AI Command (STAI)](#-ai-command-stai)
- [Support & Community](#-support--community)
- [License](#-license)

---

## 🚀 Features

- **Modular Command System** - Easy to add/remove commands
- **Premium System** - Advanced premium user management
- **Fast and Scalable** - Optimized bot core for high performance
- **Auto-restart and Watchdog** - Self-healing capabilities
- **MongoDB/SQLite Support** - Flexible database options
- **Dynamic Command Loader** - Hot-reload commands without restart
- **Thread Approval System** - Control bot access to groups
- **Anti-React System** - Advanced message management
- **Real-time Dashboard** - Live monitoring with WebSocket
- **Easy Deployment** - One-click deployment on Replit & Render
- **Custom ST-FCA** - Optimized Facebook Chat API
- **Bot Logging System** - Comprehensive logging configuration
- **Prefix Management** - Global and per-thread prefix control
- **Bio Update System** - Automatic bio updates
- **Startup Notifications** - Configurable startup messages

---

## 📝 Command Structure

<img src="https://i.ibb.co.com/4RDdwr1q/IMG-7416.jpg" alt="Command Structure" width="600">

Every command in ST-BOT follows a standardized structure for consistency and ease of development:

### Command Configuration

```javascript
module.exports = {
  config: {
    name: "commandname",           // Command name (lowercase)
    aliases: ["alias1", "alias2"], // Alternative names
    version: "1.0.0",              // Command version
    author: "Your Name",           // Author name
    countDown: 5,                  // Cooldown in seconds
    role: 0,                       // 0: Everyone, 1: Group Admin, 2: Bot Admin
    premium: false,                // true: Premium only, false: Everyone
    usePrefix: true,               // true: Requires prefix, false: No prefix needed
    description: "Command description",
    category: "category name",
    guide: "{pn} <usage guide>"    // Usage instructions
  },

  langs: {
    en: {
      success: "Command executed successfully!",
      error: "An error occurred!"
    }
  },

  onStart: async function({ message, args, event, api, getLang }) {
    // Main command logic
    message.reply(getLang("success"));
  },

  onReply: async function({ message, Reply, event, api }) {
    // Handle user replies to bot messages
  },

  onChat: async function({ message, event, args }) {
    // Listen to all messages (without prefix)
  },

  onReaction: async function({ message, Reaction, event, api }) {
    // Handle reactions to bot messages
  }
};
```

### Available Functions

- **`message.reply(text)`** - Reply to user messages
- **`message.send(text, threadID)`** - Send message to specific thread
- **`message.unsend(messageID)`** - Unsend a message
- **`message.reaction(emoji, messageID)`** - React to a message
- **`message.pr(processingMessage, processingEmoji, successEmoji, errorEmoji)`** - Advanced processing message handler
  - `processingMessage` (optional): Message to display during processing (default: "⏳ Processing...")
  - `processingEmoji` (optional): Emoji to react with during processing (default: "⏳")
  - `successEmoji` (optional): Emoji to react with on success (default: "✅")
  - `errorEmoji` (optional): Emoji to react with on error (default: "❌")
  - Returns object with methods: `edit(message)`, `success(message)`, `error(message)`
- **`api.sendMessage()`** - Direct API message sending
- **`getLang(key, ...args)`** - Get localized text
- **`usersData.get(userID)`** - Get user data
- **`threadsData.get(threadID)`** - Get thread data

#### Example: Using message.pr() with custom emojis

```javascript
// Default emojis
const pr = await message.pr("⏳ Processing your request...");
await pr.success("✅ Done!");

// Custom emojis
const pr = await message.pr("🔄 Working on it...", "🔄", "🎉", "💔");
await pr.success("🎉 All done!");
await pr.error("💔 Something went wrong!");
```

---

## ⚙️ Configuration Guide

<img src="https://i.ibb.co.com/RGH2h5LZ/IMG-7415.jpg" alt="Prefix Configuration" width="600">

### Global Prefix System

Configure prefix usage in `config.json`:

```json
{
  "prefix": "!",
  "usePrefix": {
    "enable": true,                    // Global prefix requirement
    "adminUsePrefix": {
      "enable": true,                  // Admin prefix requirement
      "specificUids": []               // Specific users who need prefix
    }
  }
}
```

**Options:**
- `usePrefix.enable: true` - All users must use prefix
- `usePrefix.enable: false` - No prefix required globally
- `adminUsePrefix.enable: true` - Admins must use prefix
- `adminUsePrefix.enable: false` - Admins don't need prefix
- `specificUids: ["uid1", "uid2"]` - Specific users affected by admin rules

### Bot Account Configuration

Login credentials are set in `config.json`:

```json
{
  "botAccount": {
    "email": "your_email@example.com",
    "password": "your_password",
    "userAgent": "Mozilla/5.0...",
    "autoUseWhenEmpty": true
  }
}
```

**Note:** If `account.txt` is empty, the bot will automatically use credentials from `config.json` to fetch cookies.

---

## 🔧 Installation & Setup

### 🖥 Method 1: Local Setup

1. **Clone the repository**:
```bash
git clone https://github.com/sheikhtamimlover/ST-BOT.git && cp -r ST-BOT/. . && rm -rf ST-BOT
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure the bot**:
   - Set your **Admin UID** in `config.json` → `adminBot` array
   - Add your **Facebook email/password** in `config.json` → `botAccount`
   - Or add cookies directly in `account.txt` (JSON format)

4. **Start the bot**:
=======
  <img src="https://i.ibb.co/RQ28H2p/banner.png" alt="banner" width="100%">
  
  <h1>
    <img src="./dashboard/images/logo-non-bg.png" width="30px" style="vertical-align: middle">
    Goat Bot V2 - Enhanced Facebook Messenger Bot
  </h1>
  
  <p>
    <a href="https://nodejs.org/dist/v20.0.0">
      <img src="https://img.shields.io/badge/Node.js-20.x-brightgreen.svg?style=for-the-badge&logo=node.js" alt="Node.js v20.x">
    </a>
    <img src="https://img.shields.io/github/repo-size/ntkhang03/Goat-Bot-V2.svg?style=for-the-badge&label=size&color=blue" alt="Repo Size">
    <img src="https://img.shields.io/badge/dynamic/json?color=orange&label=version&prefix=v&query=%24.version&url=https://github.com/ntkhang03/Goat-Bot-V2/raw/main/package.json&style=for-the-badge" alt="Version">
    <img src="https://visitor-badge.laobi.icu/badge?style=for-the-badge&page_id=ntkhang3.Goat-Bot-V2&color=red" alt="Visitors">
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  </p>
  
  <h3>✨ Created by <a href="https://github.com/ntkhang03">NTKhang</a> | Modified & Enhanced by <a href="https://github.com/NeoKEX">NeoKEX</a></h3>
  
  <p>
    <strong>🚀 No Google Credentials Required!</strong><br>
    <em>Uses @neoaz07/nkxfca for seamless Facebook integration</em>
  </p>
</div>

<br>

<div align="center">
  
  ### 🌟 Key Features
  
  | Feature | Description |
  |---------|-------------|
  | 🔐 **No Google Auth** | No need for Google API credentials or complex OAuth setup |
  | ⚡ **Fast & Lightweight** | Built on unofficial Facebook API for optimal performance |
  | 🎭 **Role-Based Access** | 5-tier permission system (User → Group Admin → Bot Admin → Premium → Developer) |
  | 💰 **Premium System** | Money-based premium features for advanced commands |
  | 🛡️ **Developer Tools** | Built-in shell & eval for developers (role 4) |
  | 🎯 **Smart Commands** | Auto-suggestion for typos & helpful hints |
  | ☁️ **Deploy Anywhere** | Ready for Render, Railway, Replit, VPS, and more |
  | 🚀 **Performance** | Optimized with caching, batching, and efficient memory management |
  | 🤖 **AI Commands** | Image generation, editing, upscaling, and background removal |
  | 🔄 **Multi-Account** | Auto-switch accounts on suspension/lockout - no restarts needed |
  
</div>

- [📝 **Note**](#-note)
- [🚧 **Requirement**](#-requirement)
- [📝 **Tutorial**](#-tutorial)
- [💡 **How it works?**](#-how-it-works)
- [🔔 **How to get notification when have new update?**](#-how-to-get-notification-when-have-new-update)
- [🆙 **How to Update**](#-how-to-update)
- [🛠️ **How to create new commands**](#️-how-to-create-new-commands)
- [💭 **Support**](#-support)
- [📚 **Support Languages in source code**](#-support-languages-in-source-code)
- [📌 **Common Problems**](#-common-problems)
- [❌ **DO NOT USE THE ORIGINAL UNDERGRADUATE VERSION**](#-do-not-use-the-original-undergraduate-version)
- [📸 **Screenshots**](#-screenshots)
- [✨ **Copyright (C)**](#-copyright-c)
- [📜 **License**](#-license)

<hr>

## 📝 **Important Notes**

> ⚠️ **Account Safety First**
> - This bot uses [@neoaz07/nkxfca](https://github.com/NeoKEX/nkxfca) (Facebook Chat API)
> - **No Google API credentials needed** - Simple setup with just your Facebook account
> - Using unofficial APIs may risk account restrictions
> - **Recommended:** Use a secondary/clone Facebook account
> - The developers are not responsible for any account issues

### ✨ **What's New in this Enhanced Version**
- 🎖️ **Advanced Role System**: 5 permission levels (0-4) for granular access control
- 💎 **Premium Users** (Role 3): Money-based premium features
- 👨‍💻 **Developers** (Role 4): Full system access with shell & eval commands
- 🤖 **Smart Command Suggestions**: Typo detection with closest match suggestions
- 😡 **React to Delete**: Admins/Devs can react with 😡/😠 to unsend bot messages
- ☁️ **Deploy Ready**: Pre-configured for Render, Railway & more
- 🎨 **Clean Icons**: Replaced emoji clutter with elegant Unicode icons
- ⚡ **Performance Optimizations**:
  - Map-based Spam Tracker with O(1) operations
  - TTL-based Cooldown Manager with automatic cleanup
  - Analytics Batching for reduced database load
  - Thread Batching for efficient loading
  - Typing Indicator support
  - Graceful Shutdown handling
  - **Memory Management**: TTLMap for auto-expiring data, MemoryManager for heap monitoring, DatabaseCacheManager for LRU eviction
- 🔄 **Multi-Account Support**:
  - Auto-switch to backup accounts on suspension/lockout
  - Single account mode: auto-retry with exponential backoff
  - Admin commands: `{prefix}account status`, `{prefix}account switch`
  - Create `account2.txt`, `account3.txt` for backup accounts

## 🚧 **Requirements**
- Node.js 16.x or 20.x [Download](https://nodejs.org/dist/v20.0.0) | [Home](https://nodejs.org/en/download/)
- Basic knowledge of JavaScript/Node.js (optional but helpful)
- A secondary/clone Facebook account (recommended)
- **No Google API credentials required!**

## 📝 **Installation & Deployment**

### 🚀 Quick Start (Local)
```bash
git clone https://github.com/ntkhang03/Goat-Bot-V2.git
cd Goat-Bot-V2
npm install
```
Configure `config.json` with your Facebook credentials, then:
>>>>>>> 9bbaa51 (update)
```bash
npm start
```

<<<<<<< HEAD
### 🌐 Method 2: Deploy on Render (Recommended)

[![Deploy on Render](https://img.shields.io/badge/Deploy%20on-Render-667881?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

1. Click the "Deploy on Render" button above
2. Configure your bot in `config.json`
3. Click the **Run** button - Render handles everything automatically!

---

## 💎 Premium System

<img src="https://i.ibb.co.com/SYnXPfm/IMG-7399.jpg" alt="Premium System" width="600">

The bot includes a comprehensive premium user management system.

### How Premium Works

**For Users:**
- Request premium access: `.premium request <message>`
- Premium users get exclusive command access

**For Admins:**
- Add premium: `.premium add <uid/@mention>`
- Remove premium: `.premium remove <uid/@mention>`
- View premium users: `.premium list`
- Check pending requests: `.premium pending`

### Creating Premium Commands

```javascript
module.exports = {
  config: {
    name: "premiumcommand",
    premium: true,  // Makes this command premium-only
    role: 0,
    // ... other config
  },

  onStart: async function({ message }) {
    message.reply("🌟 This is a premium feature!");
  }
};
```

---

## 🔌 ST-FCA (Custom Facebook API)

ST-BOT uses **ST-FCA** - an optimized, custom-built Facebook Chat API for better performance and reliability.

### Installation

```bash
npm install stfca
```

### GitHub Repository

🔗 [https://github.com/sheikhtamimlover/ST-FCA.git](https://github.com/sheikhtamimlover/ST-FCA.git)

### Features

- ✅ Better stability and performance
- ✅ Optimized for ST-BOT
- ✅ Regular updates and bug fixes
- ✅ Enhanced error handling
- ✅ Improved cookie management

---

## 🎯 Advanced Features

### Thread Approval System

<img src="https://i.ibb.co.com/JwGKNzFp/IMG-7405.jpg" alt="Thread Approval 1" width="600">
<img src="https://i.ibb.co.com/hxFwcf30/IMG-7404.jpg" alt="Thread Approval 2" width="600">

Control which groups can use your bot:

```json
{
  "threadApproval": {
    "enable": true,
    "adminNotificationThreads": ["thread_id"],
    "autoApproveExisting": true,
    "sendNotifications": true,
    "sendThreadMessage": true,
    "autoApprovedThreads": []
  }
}
```

**Commands:**
- `!threadapprove list` - View all threads
- `!threadapprove approve <tid>` - Approve a thread
- `!threadapprove unapprove <tid>` - Unapprove a thread
- `!threadapprove pending` - View pending threads

### Bot Logging System

<img src="https://i.ibb.co.com/B23tJ0JN/IMG-7413.jpg" alt="Bot Logging" width="600">

Configure comprehensive logging:

```json
{
  "botLogging": {
    "enable": true,
    "sendToThreads": true,
    "logThreadIds": ["thread_id"],
    "sendToAdmins": false,
    "silentOnDisabledThreads": true,
    "logBotAdded": false,
    "logBotKicked": true
  }
}
```

### Anti-React System

Admin-only message management through reactions:

```json
{
  "antiReact": {
    "enable": true,
    "reactByUnsend": {
      "enable": true,
      "emojis": ["👍"]
    },
    "reactByRemove": {
      "enable": true,
      "emoji": "⚠"
    },
    "onlyAdminBot": true
  }
}
```

### Bio Update System

<img src="https://i.ibb.co.com/HTm9jymD/IMG-7411.jpg" alt="Bio Update 1" width="600">
<img src="https://i.ibb.co.com/TDBnzRVt/IMG-7412.jpg" alt="Bio Update 2" width="600">

Automatically update bot bio:

```json
{
  "bioUpdate": {
    "enable": true,
    "bioText": "ST Bot - Your custom bio here",
    "updateOnce": true
  }
}
```

### Startup Notifications

<img src="https://i.ibb.co.com/nNbvwfwZ/IMG-7396.jpg" alt="Startup Notification" width="600">

Send notifications when bot starts:

```json
{
  "botStartupNotification": {
    "enable": true,
    "sendToThreads": {
      "enable": true,
      "threadIds": ["thread_id"]
    },
    "sendToAdmin": {
      "enable": false,
      "adminId": ""
    },
    "message": "🤖 Bot is now online!"
  }
}
```

---

## 📊 Dashboard

<img src="https://i.ibb.co.com/MkHNNYnZ/Screenshot-2025-10-16-090815.png" alt="Dashboard" width="800">

Access the powerful web dashboard with enhanced security:

```json
{
  "dashBoard": {
    "enable": true,
    "port": 3021,
    "passwordProtection": {
      "enable": true,
      "password": "your_secure_password"
    }
  }
}
```

**Features:**
- 📊 Real-time statistics
- 👥 User management
- 💎 Premium user control
- 📝 Thread management
- 📈 Command analytics
- 🔧 System monitoring

---

## 🛍️ ST Handlers Store

<img src="https://i.ibb.co.com/B2xZPTxL/IMG-7414.jpg" alt="ST Handlers" width="600">

Browse, install, and share commands, events, and APIs!

### Usage

```bash
!sthandlers                    # Open main menu
!sthandlers <filename>         # Install from store
!sthandlers <name> <code>      # Upload command
!sthandlers -e <name> <code>   # Upload event
!sthandlers -p <filename>      # Upload from file path
```

### Features

- ✅ Browse commands by category
- ✅ Install commands instantly
- ✅ Share your own creations
- ✅ Version control
- ✅ Auto-load installed commands
- ✅ Community-driven content

---

## 🤖 AI Command (STAI)

<img src="https://i.ibb.co.com/t7ZgxMP/IMG-7398.jpg" alt="STAI Command" width="600">

The most advanced AI command with code generation and bug fixing capabilities!

### Features

- 🧠 Generate commands and events
- 🐛 Fix bugs in existing code
- 💡 Code suggestions and improvements
- 🔧 Auto-formatting and optimization
- 📝 Documentation generation

### Usage

```bash
!stai generate command <description>
!stai generate event <description>
!stai fix <command_name>
!stai improve <code>
```

---

## 📞 Support & Community

### Need Help?

- 📱 **Messenger Group**: [Join Support Group](https://m.me/j/AbYvFRTzENblDU94/)
- 📸 **Instagram**: [@sheikh.tamim_lover](https://www.instagram.com/sheikh.tamim_lover/)
- 💬 **Facebook**: [m.me/tormairedusi](https://m.me/tormairedusi)
- 🐛 **Report Issues**: Use `!streport <your issue>` command

### Regular Updates

- ✅ Active development and maintenance
- ✅ Regular feature additions
- ✅ Bug fixes and improvements
- ✅ Community-driven enhancements

### Report Issues

Use the built-in report command:
```bash
!streport <describe your issue or feature request>
```

Your report will be sent directly to the developer!

---

## 📋 Essential Commands

| Command | Description | Access |
|---------|-------------|---------|
| `!help` | View all commands | All Users |
| `!prefix` | View/change prefix | Group Admin |
| `!premium request` | Request premium | All Users |
| `!premium add` | Add premium user | Bot Admin |
| `!threadapprove` | Manage thread approval | Bot Admin |
| `!botlog` | Configure bot logging | Bot Admin |
| `!sthandlers` | Access command store | All Users |
| `!stai` | AI assistant | All Users |
| `!streport` | Report issues | All Users |
| `!update` | Update bot | Bot Admin |

---

## 🔄 Regular Updates & Maintenance

This project receives regular updates with:
- 🆕 New Features
- 🐛 Bug Fixes  
- 🔒 Security Patches
- ⚡ Performance Optimizations
- 💎 Premium Features

**Stay updated** by:
- ⭐ Starring this repository
- 👀 Watching for releases
- 📱 Following on Instagram
- 💬 Joining the support group

---

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software, but please maintain the original credits.

**Original GoatBot V2** by NTKhang  
**Enhanced & Maintained** by Sheikh Tamim

---

## ❤️ Support the Project

If you find this project helpful:
- ⭐ Star this repository
- 🍴 Fork and contribute
- 📢 Share with others
- 💬 Join our community
- 🔗 Follow on Instagram: [@sheikh.tamim_lover](https://www.instagram.com/sheikhtamimlover/)

---

<div align="center">

**Happy Botting! 🤖✨**

*Made with ❤️ by Sheikh Tamim*

**GitHub:** [sheikhtamimlover/ST-BOT](https://github.com/sheikhtamimlover/ST-BOT)  
**ST-FCA:** [sheikhtamimlover/ST-FCA](https://github.com/sheikhtamimlover/ST-FCA)

</div>
=======
### ☁️ Cloud Deployment
Choose your preferred platform:
- **[Render](DEPLOY.md#render)** - Free tier available, auto-deploy from GitHub
- **[Railway](DEPLOY.md#railway)** - $5/month free credit, excellent for 24/7 bots
- **[Replit](DEPLOY.md#replit)** - Quick setup, perfect for testing
- **[VPS/Server](DEPLOY.md#vpsserver)** - Full control, use PM2 for process management

📘 **Detailed deployment guide**: See [DEPLOY.md](DEPLOY.md)

### 📺 Video Tutorials
- For mobile phone: https://www.youtube.com/watch?v=grVeZ76HlgA
- For VPS/Windows: https://www.youtube.com/watch?v=uCbSYNQNEwY
  
Summary instructions:
- See [here](https://github.com/ntkhang03/Goat-Bot-V2/blob/main/STEP_INSTALL.md)

---

## 🔄 **Multi-Account Support (New)**

The bot now supports multiple Facebook accounts with automatic failover:

### Setup
1. **Primary Account**: Paste credentials in `account.txt`
2. **Backup Accounts**: Create `account2.txt`, `account3.txt`, etc. with backup account credentials

### How It Works
| Scenario | Behavior |
|----------|----------|
| **Single Account** (`account.txt` only) | Auto-retry with exponential backoff (30s → 5min). Bot never exits, keeps trying until account recovers |
| **Multiple Accounts** | Auto-switch to backup account when current account is suspended/locked/logged out. No restart needed |
| **All Accounts Failed** | Cycles back to first account and continues retrying |

### Admin Commands
- `{prefix}account status` - View multi-account status and available accounts
- `{prefix}account switch` - Manually switch to next account
- `{prefix}account reset` - Reset failed accounts list

### Supported Account Formats
- **JSON Cookies**: `[{"key":"c_user","value":"123","domain":"facebook.com"}]`
- **String Cookies**: `c_user=123; xs=abc123`
- **Access Token**: `EAAAA...`
- **Email/Password**: `email|password|2fa_code`

---



## 💡 **How it works?**
- The bot uses the unofficial facebook api to send and receive messages from the user.
- When having a `new event` (message, reaction, new user join, user leave chat box,...) the bot will emit an event to the `handlerEvents`.
- The `handlerEvents` will handle the event and execute the command:
  - `onStart`:
    - the handler will check if user `call a command or not`.
    - if yes, it will check if `user banned` or mode `admin box only is turned on` or not, if not, it will execute the command.
    - next, it will check the `permission` of the user.
    - next, it will check if the `countdown` of command is over or not.
    - finally, it will execute the command and `log` information to the console.

  - `onChat`:
    - the handler will run `when the user sends a message`.
    - it will check `permission` of the user.
    - the handler will `execute` the command, if it return a `function` or `async function` then it willl check `user banned` or mode `admin box only is turned on` or not, if not, it will call the function and `log` information to the console.

  - `onFirstChat`:
    - the handler will run `when get the first message` from the chat box since the bot started.
    - the way it works is like `onChat`.

  - `onReaction`:
    - the handler will run when the user `reacts` to a `message has messageID` is set in `GoatBot.onReaction` as follows:
                ```javascript
                // example:     
                global.GoatBot.onReaction.set(msg.messageID, {
                        messageID: msg.messageID,
                        commandName,
                        // ... and more
                });
                ```
    - the handler will automatically add method `delete`, if this method is called, it will delete the message from the set.
    - next, it will check `permission` of the user and `execute` if the user has permission and `log` information to the console.

  - `onReply`:
    - the handler will run when the user `replies` to a `message has messageID` is set in `GoatBot.onReply` as follows:
                ```javascript
                // example:
                global.GoatBot.onReply.set(msg.messageID, {
                        messageID: msg.messageID,
                        commandName,
                        // ... and more
                });
                ```
    - the handler will automatically add method `delete`, if this method is called, it will delete the message from the set.
    - next, it will check `permission` of the user and `execute` if the user has permission and `log` information to the console.  

  - `onEvent`:
    - the handler will run `when the user has a new event` type `event` (new user join, user leave chat box, change admin box,...)
                ```javascript
                // example:
                global.GoatBot.onEvent.set(msg.messageID, {
                        messageID: msg.messageID,
                        commandName,
                        // ... and more
                });
                ```
                - it will loop through all `onEvent` and get the command determined by the key `commandName` and execute the `onEvent` in that command.
                - if it return a `function` or `async function` then it will call the function and `log` information to the console.

  - `handlerEvent`:
    - the handler will run `when the user has a new event` type `event` (new user join, user leave chat box, change admin box,...)
    - it will get all the eventCommand set in `GoatBot.eventCommands` (scripts placed in the `scripts/events` folder)
    - it will loop through all `eventCommands` and run the `onStart` in that command.
    - if it return a `function` or `async function` then it will call the function and `log` information to the console.


## 🔔 **How to get notification when have new update?**
- Click on the `Watch` button in the upper right corner of the screen and select `Custom` and select `Pull requests` and `Releases` and click `Apply` to get notified when there is a new update.

## 🆙 **How to Update**
Tutorial has been uploaded on YouTube
- on phone/repl: https://youtu.be/grVeZ76HlgA?t=1342
- on vps/computer: https://youtu.be/uCbSYNQNEwY?t=508

## 🛠️ **How to create new commands**
- See [here](https://github.com/ntkhang03/Goat-Bot-V2/blob/main/DOCS.md)

## 💭 **Support**
If you have major coding issues with this bot, please join and ask for help.
- https://discord.com/invite/DbyGwmkpVY (recommended)
- https://www.facebook.com/groups/goatbot
- https://m.me/j/Abbq0B-nmkGJUl2C
- ~~https://t.me/gatbottt~~ (no longer supported)
- ***Please do not inbox me, I do not respond to private messages, any questions please join the chat group for answers. ThankThanks!***

## 📚 **Support Languages in source code**
- Currently, the bot supports 2 languages:
- [x] `en: English`
- [x] `vi: Vietnamese`

- Change language in `config.json` file
- You can customize the language in the folder `languages/`, `languages/cmds/` and `languages/events/`

## 📌 **Common Problems**
<details>
        <summary>
                📌 Error 400: redirect_uri_mismatch
        </summary>
        <p><img src="https://i.ibb.co/6Fbjd4r/image.png" width="250px"></p> 
        <p>1. Enable Google Drive API: <a href="https://youtu.be/nTIT8OQeRnY?t=347">Tutorial</a></p>
        <p>2. Add uri <a href="https://developers.google.com/oauthplayground">https://developers.google.com/oauthplayground</a> (not <a href="https://developers.google.com/oauthplayground/">https://developers.google.com/oauthplayground/</a>) to <b>Authorized redirect URIs</b> in <b>OAuth consent screen:</b> <a href="https://youtu.be/nTIT8OQeRnY?t=491">Tutorial</a></p>  
        <p>3. Choose <b>https://www.googleapis.com/auth/drive</b> and <b>https://mail.google.com/</b> in <b>OAuth 2.0 Playground</b>: <a href="https://youtu.be/nTIT8OQeRnY?t=600">Tutorial</a></p>
</details>

<details>
        <summary>
                📌 Error for site owners: Invalid domain for site key
        </summary>
                <p><img src="https://i.ibb.co/2gZttY7/image.png" width="250px"></p>
                <p>1. Go to <a href="https://www.google.com/recaptcha/admin">https://www.google.com/recaptcha/admin</a></p>
                <p>2. Add domain <b>repl.co</b> (not <b>repl.com</b>) to <b>Domains</b> in <b>reCAPTCHA v2</b> <a href="https://youtu.be/nTIT8OQeRnY?t=698">Tutorial</a></p>
</details>

<details>
        <summary>
                📌 GaxiosError: invalid_grant, unauthorized_client 
        </summary>
                <p><img src="https://i.ibb.co/n7w9TkH/image.png" width="250px"></p>
                <p><img src="https://i.ibb.co/XFKKY9c/image.png" width="250px"></p>
                <p><img src="https://i.ibb.co/f4mc5Dp/image.png" width="250px"></p>
                <p>- If you don't publish the project in google console, the refresh token will expire after 1 week and you need to get it back. <a href="https://youtu.be/nTIT8OQeRnY?t=445">Tuatorial</a></p>
</details>

<details>
        <summary>
                📌 GaxiosError: invalid_client
        </summary>
                <p><img src="https://i.ibb.co/st3W6v4/Pics-Art-01-01-09-10-49.jpg" width="250px"></p>
                <p>- Check if you have entered your google project client_id correctly <a href="https://youtu.be/nTIT8OQeRnY?t=509">Tuatorial</a></p>
</details>

<details>
        <summary>
                📌 Error 403: access_denied
        </summary>
                <p><img src="https://i.ibb.co/dtrw5x3/image.png" width="250px"></p>
                <p>- If you don't publish the project in google console only the approved accounts added to the project can use it <a href="https://youtu.be/nTIT8OQeRnY?t=438">Tuatorial</a></p>
</details>

## ❌ **DO NOT USE THE ORIGINAL UNDERGRADUATE VERSION**
- The use of unknown source code can lead to the device being infected with viruses, malware, hacked social accounts, banks, ...
- Goat-Bot-V2 is only published at https://github.com/ntkhang03/Goat-Bot-V2, all other sources, all forks from other github, replit,... are fake, violate policy
- If you use from other sources (whether accidentally or intentionally) it means that you are in violation and will be banned without notice
## 📸 **Screenshots**
- ### Bot
<details>
        <summary>
                Rank system
        </summary>

  - Rank card:
  <p><img src="https://i.ibb.co/d0JDJxF/rank.png" width="399px"></p>

  - Rankup notification:
  <p><img src="https://i.ibb.co/WgZzthH/rankup.png" width="399px"></p>

  - Custom rank card:
  <p><img src="https://i.ibb.co/hLTThLW/customrankcard.png" width="399px"></p>
</details>

<details>
        <summary>
                Weather
        </summary>
        <p><img src="https://i.ibb.co/2FwWVLv/weather.png" width="399px"></p>
</details>

<details>
        <summary>
                Auto send notification when have user join or leave box chat (you can custom message)
        </summary>
        <p><img src="https://i.ibb.co/Jsb5Jxf/wcgb.png" width="399px"></p>
</details>

<details>
        <summary>
                Openjourney
        </summary>
        <p><img src="https://i.ibb.co/XJfwj1X/Screenshot-2023-05-09-22-43-58-630-com-facebook-orca.jpg" width="399px"></p>
</details>

<details>
        <summary>
                GPT
        </summary>
        <p><img src="https://i.ibb.co/D4wRbM3/Screenshot-2023-05-09-22-47-48-037-com-facebook-orca.jpg" width="399px"></p>
        <p><img src="https://i.ibb.co/z8HqPkH/Screenshot-2023-05-09-22-47-53-737-com-facebook-orca.jpg" width="399px"></p>
        <p><img src="https://i.ibb.co/19mZQpR/Screenshot-2023-05-09-22-48-02-516-com-facebook-orca.jpg" width="399px"></p>
</details>



- ### Dashboard
<details>
        <summary>
                Home:
        </summary>
        <p><img src="https://i.postimg.cc/GtwP4Cqm/Screenshot-2023-12-23-105357.png" width="399px"></p>
        <p><img src="https://i.postimg.cc/MTjbZT0L/Screenshot-2023-12-23-105554.png" width="399px"></p>
</details>

<details>
        <summary>
                Stats:
        </summary>
        <p><img src="https://i.postimg.cc/QtXt98B7/image.png" width="399px"></p>
</details>

<details>
        <summary>
                Login/Register:
        </summary>
        <p><img src="https://i.postimg.cc/Jh05gKsM/Screenshot-2023-12-23-105743.png" width="399px"></p>
        <p><img src="https://i.postimg.cc/j5nM9K8m/Screenshot-2023-12-23-105748.png" width="399px"></p>
</details>

<details>
        <summary>
                Dashboard Thread:
        </summary>
        <p><img src="https://i.postimg.cc/RF237v1Z/Screenshot-2023-12-23-105913.png" width="399px"></p>
</details>

<details>
        <summary>
                Custom on/off:
        </summary>
        <p><img src="https://i.ibb.co/McDRhmX/image.png" width="399px"></p>
</details>

<details>
        <summary>
                Custom welcome message (similar with leave, rankup (coming soon), custom command (coming soon))
        </summary>
        <p><img src="https://i.ibb.co/6ZrQqc1/image.png" width="399px"></p>
        <p><img src="https://i.ibb.co/G53JsXm/image.png" width="399px"></p>
</details>

## ✨ **Copyright (C)**
- **[NTKhang (NTKhang03)](https://github.com/ntkhang03)**
- **[NeoKEX](https://github.com/NeoKEX)**

## 📜 **License**

**VIETNAMESE**

- ***Nếu bạn vi phạm bất kỳ quy tắc nào, bạn sẽ bị cấm sử dụng dự án của tôi***
- Không bán mã nguồn của tôi
- Không tự xưng là chủ sở hữu của mã nguồn của tôi
- Không kiếm tiền từ mã nguồn của tôi (chẳng hạn như: mua bán lệnh, mua bán/cho thuê bot, kêu gọi quyên góp, v.v.)
- Không xóa/sửa đổi credit (tên tác giả) trong mã nguồn của tôi

**ENGLISH**

- ***If you violate any rules, you will be banned from using my project***
- Don't sell my source code
- Don't claim my source code as your own
- Do not monetize my source code (such as: buy and sell commands, buy and sell bots, call for donations, etc.)
- Don't remove/edit my credits (author name) in my source code

>>>>>>> 9bbaa51 (update)
