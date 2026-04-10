const axios = require('axios');
<<<<<<< HEAD
const baseApiUrl = async () => {
    const base = await axios.get("https://gitlab.com/Rakib-Adil-69/shizuoka-command-store/-/raw/main/apiUrls.json");
    return base.data.dalle;
};

module.exports = {
    config: {
        name: "dalle3",
        version: "1.1",
        author: "Rakib Adil",
        role: 0,
        description: "generate a image using dalle3 Ai",
        guide: "{pn}dalle3 <prompt>",
        category: "Ai",
        countDown: 10
    },
    onStart: async function ({ api, event, args}) {

        const prompt = encodeURIComponent(args.join(" "));
        if (!prompt) return api.sendMessage("please provide a prompt to generate image. \n Example: {pn}dalle3 A cat", event.threadID, event.messageID);
        
        api.setMessageReaction("🚀", event.messageID, (err) => {}, true);
        const loadMsg = await api.sendMessage("𝙋𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩 𝙖 𝙢𝙞𝙣𝙪𝙩𝙚..☺️", event.threadID, event.messageID);
        try {
            const baseUrl = await baseApiUrl();
            const response = await axios.post(`${baseUrl}/dalle`,{
                prompt: prompt,
                n: 1,
                model: "dall-e-3",
                size: "1024x1024"
            });

            const images = response.data?.images?.data?.data || [response.data.images || response.data.response];
            
            if (!images.length) return api.sendMessage("No Images found",event.threadID, event.messageID);

            const imageUrl = images[0].url;
            const ext = imageUrl.split(".").pop() || "png";
            
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            
            api.unsendMessage(loadMsg.messageID);

            await api.sendMessage({ body: `Here is your genetated Image ${prompt} \n author: 𝙍𝙖𝙠𝙞𝙗 𝘼𝙙𝙞𝙡`, 
            attachment: await global.utils.getStreamFromURL(imageUrl, `image.${ext}`) 
        }, event.threadID, event.messageID);


        } catch(err) {
            console.log(err);
            api.setMessageReaction("❌", event.messageID, event.threadID, ()=>{}, true);
            api.sendMessage("An Error while generating image.", event.threadID, event.messageID);
        }
    }
 };
=======
const fs = require('fs-extra'); 
const path = require('path');

const API_ENDPOINT = "https://neokex-img-api.vercel.app/generate"; 

module.exports = {
  config: {
    name: "dalle3",
    aliases: ["dalle"],
    version: "1.0", 
    author: "NeoKEX",
    countDown: 15,
    role: 0,
    longDescription: "Generate an image using the DALL-E 3 model.",
    category: "ai-image",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function({ message, args, event }) {
    
    let prompt = args.join(" ");

    if (!prompt) {
        return message.reply("❌ Please provide a prompt.");
    }

    message.reaction("🎨", event.messageID);
    let tempFilePath; 

    try {
      const fullApiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(prompt.trim())}&model=dalle3`;
      
      const response = await axios.get(fullApiUrl, {
          responseType: 'stream',
          timeout: 60000 
      });

      if (response.status !== 200) {
           throw new Error(`API error: ${response.status}`);
      }
      
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
          await fs.ensureDir(cacheDir); 
      }
      
      tempFilePath = path.join(cacheDir, `dalle3_${Date.now()}.png`);
      
      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      message.reaction("✅", event.messageID);
      await message.reply({
        body: `DALL-E 3 image generated 🐦`,
        attachment: fs.createReadStream(tempFilePath)
      });

    } catch (error) {
      message.reaction("❌", event.messageID);
      message.reply(`❌ Error: ${error.message}`);
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          await fs.unlink(tempFilePath);
      }
    }
  }
};
>>>>>>> 9bbaa51 (update)
