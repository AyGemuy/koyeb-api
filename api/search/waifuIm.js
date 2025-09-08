const axios = require("axios");
const path = require("path");
module.exports = {
  name: "Waifulm",
  desc: "Search gambar berdasarkan tag dan model. Lihat list tag di: https://docs.waifu.im/reference/api-reference/tags",
  category: "Search",
  params: ["search", "model"],
  async run(req, res) {
    try {
      const {
        search,
        model
      } = req.query;
      if (!search || !model) {
        return res.status(400).json({
          status: false,
          message: "Harap sertakan parameter ?search=tag&model=sfw/nsfw"
        });
      }
      const queryParams = new URLSearchParams();
      queryParams.set("included_tags", search.toLowerCase());
      queryParams.set("is_nsfw", model.toLowerCase() === "nsfw");
      const response = await axios.get(`https://api.waifu.im/search?${queryParams.toString()}`);
      const result = response.data.images?.[0];
      if (!result?.url) {
        return res.status(404).json({
          status: false,
          message: "Gambar tidak ditemukan."
        });
      }
      const ext = path.extname(result.url).toLowerCase();
      const contentType = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".mp4": "video/mp4"
      } [ext] || "application/octet-stream";
      const media = await axios.get(result.url, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", contentType);
      res.send(media.data);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message
      });
    }
  }
};