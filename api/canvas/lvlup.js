const axios = require("axios");
module.exports = {
  name: "Levelup",
  desc: "Generate level up card",
  category: "Canvas",
  params: ["avatar", "background", "username", "avatarBorderColor", "overlayOpacity", "currentLevel", "nextLevel"],
  async run(req, res) {
    const {
      avatar,
      background,
      username,
      avatarBorderColor,
      overlayOpacity,
      currentLevel,
      nextLevel
    } = req.query;
    if (!avatar || !background || !username || !avatarBorderColor || !overlayOpacity || !currentLevel || !nextLevel) return res.status(400).json({
      status: false,
      error: "Semua parameter wajib diisi!"
    });
    const url = `https://fastrestapis.fasturl.cloud/canvas/levelup?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&username=${encodeURIComponent(username)}&borderColor=2a2e35&avatarBorderColor=${encodeURIComponent(avatarBorderColor)}&overlayOpacity=${encodeURIComponent(overlayOpacity)}&currentLevel=${encodeURIComponent(currentLevel)}&nextLevel=${encodeURIComponent(nextLevel)}`;
    try {
      const result = await axios.get(url, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", result.headers["content-type"]);
      res.end(result.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};