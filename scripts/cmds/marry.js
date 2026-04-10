<<<<<<< HEAD
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    config:{
        name: "marry",
        aliases: ["biye", "hanga"],
        version: "1.0.11",
        author: "Rakib Adil",
        role: 0,
        countdown: 5,
        description: "marry a person with mention or replying her/his message",
        guide: "{p}marry @mention or reply to her/his message",
        category: "funny",
        premium: false,
        usePrefix: true
    },
    onStart: async function({event, api, message, usersData}){
        const eAuth = "52616b6962204164696c";
        const dAuth = Buffer.from(eAuth, "hex"). toString("utf8");
        const author = module.exports.config;

        if(author.author !== dAuth) return message.reply("Author name is changed, please rename it to default: Rakib Adil");

        let one = event.senderID;
        let two;
        const mention = Object.keys(event.mentions);
        if(mention.length > 0){
            two = mention[0];
        }else if(event.type === "message_reply"){
            two = event.messageReply.senderID;
        }else{
           return message.reply("Please @mention or reply someone to marry 🐸👫");
        };
            try {
                const ppUrl1 = await usersData.getAvatarUrl(one);
                const ppUrl2 = await usersData.getAvatarUrl(two);
                const canvas = createCanvas(900, 850);
                const ctx = canvas.getContext("2d");
                const bgImg = await loadImage("https://files.catbox.moe/pxougj.jpg");
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

                const pp1 = await loadImage(ppUrl1);
                const pp2 = await loadImage(ppUrl2);

                ctx.save();
                ctx.beginPath();
                ctx.arc(635, 255, 85, 0, Math.PI * 2);
                ctx.lineWidth = 5;
                ctx.strokeStyle = "rgb(255, 105, 180)";
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(pp1, 550, 170, 170, 170);
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.arc(235, 255, 85, 0, Math.PI * 2);
                ctx.lineWidth = 5;
                ctx.strokeStyle = "rgb(0, 191, 255)";
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(pp2, 150, 170, 170, 170);
                ctx.restore();
                
                const path = __dirname + "/cache/marry.png";
                const buffer = canvas.toBuffer("image/png");
                fs.writeFileSync(path, buffer);
                
                const userName1 = await usersData.getName(one);
                const userName2 = await usersData.getName(two);
                
                api.sendMessage({
                    
                    body:`${userName1} married to ${userName2}, congratulations to both of you😊💐`,
                    
                    attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path), event.messageID);
            } catch (e) {
                console.log(e);
                message.reply("An error occurred while processing the image. Please try again later.");
                return;
         };
    }
};
=======
const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs")
module.exports = {
    config: {
        name: "marry",
        aliases: ["marryv4","marryfour"],
        version: "1.0",
        author: "\x4c\x45\x41\x52\x4e\x20\x54\x4f\x20\x45\x41\x54\x20\x4c\x45\x41\x52\x4e\x20\x54\x4f\x20\x53\x50\x45\x41\x4b\x20\x42\x55\x54\x20\x44\x4f\x4e\'\x54\x20\x54\x52\x59\x20\x54\x4f\x20\x43\x48\x41\x4e\x47\x45\x20\x54\x48\x45\x20\x43\x52\x45\x44\x49\x54\x20\x41\x4b\x41\x53\x48",//don't change credit otherwise I'm gonna fuck your mom
        countDown: 5,
        role: 0,
        shortDescription: "get a wife",
        longDescription: "mention your love❗",
        category: "love",
        guide: "{pn}"
    },



    onStart: async function ({ message, event, args }) {
        const mention = Object.keys(event.mentions);
      if(mention.length == 0) return message.reply("Please mention someone❗");
else if(mention.length == 1){
const one = event.senderID, two = mention[0];
                bal(one, two).then(ptth => { message.reply({ body: "got married 😍", attachment: fs.createReadStream(ptth) }) })
} else{
 const one = mention[1], two = mention[0];
            bal(one, two).then(ptth => { message.reply({ body: "got married 😍", attachment: fs.createReadStream(ptth) }) })
}
    }


};

async function bal(one, two) {//credit akash #_#

    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avone.circle()
    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avtwo.circle()
    let pth = "marryv4.png"
    let img = await jimp.read("https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg")

    img.resize(1024, 684).composite(avone.resize(85, 85), 204, 160).composite(avtwo.resize(80, 80), 315, 105);//don't change the credit X-------D

    await img.writeAsync(pth)
    return pth
}
>>>>>>> 9bbaa51 (update)
