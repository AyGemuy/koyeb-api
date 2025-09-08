const axios = require("axios");
module.exports = {
  name: "Spotify",
  desc: "Download lagu Spotify via URL",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url || !/https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/.test(url)) return res.status(400).json({
      status: false,
      error: "Parameter url harus berisi link Spotify track."
    });
    try {
      const meta = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`, {
        headers: {
          accept: "application/json",
          referer: "https://spotifydownload.org/"
        }
      });
      const {
        id,
        gid,
        name
      } = meta.data.result;
      const convert = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`, {
        headers: {
          accept: "application/json",
          referer: "https://spotifydownload.org/"
        }
      });
      const mp3Url = "https://api.fabdl.com" + convert.data.result.download_url;
      const file = await axios.get(mp3Url, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `inline; filename="${name}.mp3"`);
      return res.end(file.data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};