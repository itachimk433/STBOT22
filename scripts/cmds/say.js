const axios = require('axios');
<<<<<<< HEAD
=======
const fs = require('fs-extra');
>>>>>>> 9bbaa51 (update)

module.exports = {
  config: {
    name: "say",
<<<<<<< HEAD
    aliases: [],
    version: "2.0",
    author: "ST | Sheikh Tamim",
    countDown: 1,
    role: 0,
    shortDescription: "say something",
    longDescription: "",
    category: "Voice Generator",
    guide: {
      vi: "{pn} text ",
      en: "{pn} text "
    }
  },
  onStart: async function ({ api, message, args, event}) {
 let lng = "en"
 let say;
    if(ln.includes(args[0])){
 lng = args[0]
 args.shift()
 say = encodeURIComponent(args.join(" "))
 } else{ say = args.join(" ")}
      try {
        let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q=${say}`
message.reply({body:"",
attachment: await global.utils.getStreamFromURL(url)
})
          } catch (e) {
console.log(e)
message.reply(`Enter text lmao `) }
 }
};
const ln = [
 "af",
 "sq",
 "ar",
 "ay",
 "eu",
 "bn",
 "bs",
 "bg",
 "my",
 "ca",
 "km",
 "ch",
 "ce",
 "hr",
 "cs",
 "da",
 "dv",
 "nl",
 "en",
 "et",
 "fi",
 "fr",
 "de",
 "el",
 "gu",
 "he",
 "hu",
 "is",
 "id",
 "it",
 "ja",
 "jv",
 "kn",
 "kr",
 "ks",
 "kk",
 "rw",
 "kv",
 "kg",
 "ko",
 "kj",
 "ku",
 "ky",
 "lo",
 "la",
 "lv",
 "lb",
 "li",
 "ln",
 "lt",
 "lu",
 "mk",
 "mg",
 "ms",
 "ml",
 "mt",
 "gv",
 "mi",
 "mr",
 "mh",
 "ro",
 "mn",
 "na",
 "nv",
 "nd",
 "ng",
 "ne",
 "se",
 "no",
 "nb",
 "nn",
 "ii",
 "oc",
 "oj",
 "or",
 "om",
 "os",
 "pi",
 "pa",
 "ps",
 "fa",
 "pl",
 "pt",
 "qu",
 "rm",
 "rn",
 "ru",
 "sm",
 "sg",
 "sa",
 "sc",
 "sr",
 "sn",
 "sd",
 "si",
 "sk",
 "sl",
 "so",
 "st",
 "nr",
 "es",
 "su",
 "sw",
 "ss",
 "sv",
 "tl",
 "ty",
 "tg",
 "ta",
 "tt",
 "te",
 "th",
 "bo",
 "ti",
 "to",
 "ts",
 "tn",
 "tr",
 "tk",
 "tw",
 "ug",
 "uk",
 "ur",
 "uz",
 "ve",
 "vi",
 "vo",
 "wa",
 "cy",
 "fy",
 "wo",
 "xh",
 "yi",
 "yo",
 "za",
 "zu",
 "nɪ",
]
=======
    version: "1.7",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    category: "tts",
    description: "bot will make your text into voice.",
    guide: {
      en: "{pn} your text (default will be 'en') | {pn} your text | [use two words ISO 639-1 code, ex: English-en, Bangla-bn, Hindi-hi or more, search Google for your language code]"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);

    let text;
    let number = 'en';

    if (event.type === "message_reply") {
      text = event.messageReply.body;
    } else {
      if (args && args.length > 0) {
        if (args.includes("|")) {
          const splitArgs = args.join(" ").split("|").map(arg => arg.trim());
          text = splitArgs[0];
          number = splitArgs[1] || 'en';
        } else {
          text = args.join(" ");
        }
      } else {
        text = '';
      }
    }

    if (!text) {
      return message.reply(`Please provide some text. Example:\n${p}say hi there`);
    }

    const path = `${__dirname}/tmp/tts.mp3`;

    try {
      if (text.length <= 150) {
        const response = await axios({
          method: "get",
          url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=${number}&client=tw-ob&q=${encodeURIComponent(text)}`,
          responseType: "stream"
        });

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        writer.on("finish", () => {
          message.reply({
            body: text,
            attachment: fs.createReadStream(path)
          }, () => {
            fs.remove(path);
          });
        });
      } else {
        const chunkSize = 150;
        const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, 'g'));

        for (let i = 0; i < chunks.length; i++) {
          const response = await axios({
            method: "get",
            url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=${number}&client=tw-ob&q=${encodeURIComponent(chunks[i])}`,
            responseType: "stream"
          });

          const writer = fs.createWriteStream(path, { flags: i === 0 ? 'w' : 'a' });
          response.data.pipe(writer);

          if (i === chunks.length - 1) {
            writer.on("finish", () => {
              message.reply({
                body: text,
                attachment: fs.createReadStream(path)
              }, () => {
                fs.remove(path);
              });
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      message.reply("An error occurred while trying to convert your text to speech or send it as an attachment. Please try again later.");
    }
  }
};
>>>>>>> 9bbaa51 (update)
