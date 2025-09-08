const axios = require("axios");
module.exports = {
  name: "AIO",
  desc: "AIO Downloader input list untuk melihat list",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    try {
      const {
        url
      } = req.query;
      if (!url) return res.status(400).json({
        status: false,
        error: "URL is required"
      });
      if (url.toLowerCase() === "list") {
        return res.status(200).json({
          status: true,
          supported_sites: ["Tiktok", "Douyin", "Capcut", "Threads", "Instagram", "Facebook", "Kuaishou", "QQ", "Espn", "Pinterest", "IMDb", "Imgur", "iFunny", "Izlesene", "Reddit", "YouTube", "Twitter", "Vimeo", "Snapchat", "Bilibili", "Dailymotion", "Sharechat", "Likee", "LinkedIn", "Tumblr", "Hipi", "Telegram", "Getstickerpack", "Bitchute", "Febspot", "9GAG", "Oke.ru", "Rumble", "Streamable", "Ted", "SohuTV", "Pornbox", "Xvideos", "Xnxx", "Xiaohongshu", "Ixigua", "Weibo", "Miaopai", "Meipai", "Xiaoying", "National Video", "Yingke", "Sina", "Bluesky", "SoundCloud", "Mixcloud", "Spotify", "Zingmp3", "Bandcamp"]
        });
      }
      const {
        data
      } = await axios.get(`https://r-nozawa.hf.space/aio?url=${encodeURIComponent(url)}`);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};