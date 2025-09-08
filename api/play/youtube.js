const yts = require("yt-search");
const {
  download
} = require("../../lib/savetube");
const axios = require("axios");
module.exports = {
  name: "Youtube",
  desc: "Cari dan unduh audio YouTube dari query",
  category: "Play",
  params: ["query"],
  async run(req, res) {
    const {
      query
    } = req.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query wajib diisi!"
    });
    try {
      const result = await yts(query);
      const video = result.videos[0];
      if (!video) return res.status(404).json({
        status: false,
        error: "Video tidak ditemukan"
      });
      const saveResult = await download(video.url, "mp3");
      if (!saveResult.status) return res.status(saveResult.code || 500).json(saveResult);
      if (!saveResult.download) return res.status(500).json({
        status: false,
        error: "Gagal mendapatkan link download MP3"
      });
      const audioRes = await axios.get(saveResult.download, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `inline; filename="${video.title}.mp3"`);
      return res.end(audioRes.data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};