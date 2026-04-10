<<<<<<< HEAD

const { execSync } = require('child_process');
const log = require('./logger/log.js');

try {
    log.info("UPDATE", "Starting update process...");
    execSync("node updater.js", { stdio: 'inherit' });
} catch (error) {
    log.error("UPDATE", "Update failed:", error.message);
    process.exit(1);
}
=======
const axios = require('axios');

axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/updater.js")
	.then(res => eval(res.data));
>>>>>>> 9bbaa51 (update)
