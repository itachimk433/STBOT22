const http = require("http");
const port = process.env.PORT || 10000;

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is active and running.");
}).listen(port);

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const http = require("http"); // Add this

// 1. Create a simple server to satisfy Render's port requirement
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.write("Bot is running!");
    res.end();
}).listen(port);

function startProject() {
    // 2. Start the actual bot
    const child = spawn("node", ["Goat.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code == 2) {
            log.info("Restarting Project...");
            startProject();
        }
    });
}

startProject();
