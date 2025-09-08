const axios = require("axios");
module.exports = {
  name: "Levelup2",
  desc: "Generate level up card",
  category: "Canvas",
  params: ["background", "avatar", "fromLevel", "toLevel", "name"],
  async run(req, res) {
    const {
      background,
      avatar,
      fromLevel,
      toLevel,
      name
    } = req.query;
    if (!background || !avatar || !fromLevel || !toLevel || !name) return res.status(400).json({
      status: false,
      error: "Semua parameter wajib diisi!"
    });
    const url = `https://api.siputzx.my.id/api/canvas/level-up?backgroundURL=${encodeURIComponent(background)}&avatarURL=${encodeURIComponent(avatar)}&fromLevel=${encodeURIComponent(fromLevel)}&toLevel=${encodeURIComponent(toLevel)}&name=${encodeURIComponent(name)}`;
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