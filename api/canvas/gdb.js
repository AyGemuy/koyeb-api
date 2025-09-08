const axios = require("axios");
module.exports = {
  name: "Goodbye",
  desc: "Generate kartu sambutan",
  category: "Canvas",
  params: ["background", "description", "member", "avatar"],
  async run(req, res) {
    const {
      background,
      description,
      member,
      avatar
    } = req.query;
    const endpoint = req.path.split("/").pop().toLowerCase();
    const fixedText1 = {
      welcome: "WELCOME",
      goodbye: "GOODBYE",
      promote: "PROMOTE",
      demote: "DEMOTE"
    } [endpoint];
    if (!background || !description || !member || !avatar) return res.status(400).json({
      status: false,
      error: "Parameter background, description, member, avatar wajib diisi!"
    });
    const url = `https://api.popcat.xyz/v2/welcomecard?background=${encodeURIComponent(background)}&text1=${encodeURIComponent(fixedText1)}&text2=${encodeURIComponent(description)}&text3=${encodeURIComponent(member)}&avatar=${encodeURIComponent(avatar)}`;
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