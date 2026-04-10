const axios = require('axios');
const { config } = global.GoatBot;
const { log, getText } = global.utils;
if (global.timeOutUptime != undefined)
<<<<<<< HEAD
	clearTimeout(global.timeOutUptime);
if (!config.autoUptime.enable)
	return;

const PORT = config.dashBoard?.port || (!isNaN(config.serverUptime.port) && config.serverUptime.port) || 3001;

let myUrl = config.autoUptime.url || `https://${process.env.REPL_OWNER
	? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
	: process.env.API_SERVER_EXTERNAL == "https://api.glitch.com"
		? `${process.env.PROJECT_DOMAIN}.glitch.me`
		: `localhost:${PORT}`}`;
myUrl.includes('localhost') && (myUrl = myUrl.replace('https', 'http'));
myUrl += '/uptime';

let status = 'ok';
setTimeout(async function autoUptime() {
	try {
		await axios.get(myUrl);
		if (status != 'ok') {
			status = 'ok';
			log.info("UPTIME", "Bot is online");
			// Custome notification here
		}
	}
	catch (e) {
		const err = e.response?.data || e;
		if (status != 'ok')
			return;
		status = 'failed';

		if (err.statusAccountBot == "can't login") {
			log.err("UPTIME", "Can't login account bot");
			// Custome notification here
		}
		else if (err.statusAccountBot == "block spam") {
			log.err("UPTIME", "Your account is blocked");
			// Custome notification here
		}
	}
	global.timeOutUptime = setInterval(autoUptime, config.autoUptime.timeInterval);
}, (config.autoUptime.timeInterval || 180) * 1000);
=======
        clearTimeout(global.timeOutUptime);
if (!config.autoUptime.enable)
        return;

const PORT = config.dashBoard?.port || (!isNaN(config.serverUptime.port) && config.serverUptime.port) || 3001;

const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0];
let myUrl = config.autoUptime.url || (
        replitDomain
                ? `https://${replitDomain}`
                : process.env.API_SERVER_EXTERNAL == "https://api.glitch.com"
                        ? `https://${process.env.PROJECT_DOMAIN}.glitch.me`
                        : `http://localhost:${PORT}`
);
myUrl += '/uptime';

const intervalMs = (config.autoUptime.timeInterval || 180) * 1000;
let status = 'ok';

async function autoUptime() {
        try {
                await axios.get(myUrl);
                if (status != 'ok') {
                        status = 'ok';
                        log.info("UPTIME", "Bot is online");
                        // Custome notification here
                }
        }
        catch (e) {
                const err = e.response?.data || e;
                if (status != 'ok') {
                        global.timeOutUptime = setTimeout(autoUptime, intervalMs);
                        return;
                }
                status = 'failed';

                if (err.statusAccountBot == "can't login") {
                        log.err("UPTIME", "Can't login account bot");
                        // Custome notification here
                }
                else if (err.statusAccountBot == "block spam") {
                        log.err("UPTIME", "Your account is blocked");
                        // Custome notification here
                }
        }
        global.timeOutUptime = setTimeout(autoUptime, intervalMs);
}

global.timeOutUptime = setTimeout(autoUptime, intervalMs);
>>>>>>> 9bbaa51 (update)
log.info("AUTO UPTIME", getText("autoUptime", "autoUptimeTurnedOn", myUrl));
