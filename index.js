const { spawn } = require("child_process");
const http = require("http");
const log = require("./logger/log.js");

// 1. Create the health check server for Render
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is alive!");
}).listen(port, () => {
    console.log(`Health check server listening on port ${port}`);
});

// 2. Start the bot process
function startProject() {
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
