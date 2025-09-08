const axios = require("axios");
module.exports = {
  name: "Goodbye2",
  desc: "Generate kartu sambutan dengan style kece",
  category: "Canvas",
  params: ["avatar", "background", "description", "borderColor", "avatarBorderColor", "overlayOpacity"],
  async run(req, res) {
    const {
      avatar,
      background,
      description,
      borderColor,
      avatarBorderColor,
      overlayOpacity
    } = req.query;
    const endpoint = req.path.split("/").pop().toLowerCase();
    const fixedTitle = {
      welcome2: "WELCOME",
      goodbye2: "GOODBYE",
      promote2: "PROMOTE",
      demote2: "DEMOTE"
    } [endpoint];
    if (!avatar || !background || !description || !borderColor || !avatarBorderColor || !overlayOpacity) return res.status(400).json({
      status: false,
      error: "Semua parameter wajib diisi!"
    });
    const apiUrl = `https://fastrestapis.fasturl.cloud/canvas/welcome?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&title=${encodeURIComponent(fixedTitle)}&description=${encodeURIComponent(description)}&borderColor=${encodeURIComponent(borderColor)}&avatarBorderColor=${encodeURIComponent(avatarBorderColor)}&overlayOpacity=${encodeURIComponent(overlayOpacity)}`;
    try {
      const result = await axios.get(apiUrl, {
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