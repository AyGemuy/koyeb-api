const savetube = require("../../lib/savetube");
module.exports = {
  name: "Youtube Video",
  desc: "Download video from YouTube via SaveTube",
  category: "Downloader",
  params: ["url", "format"],
  async run(req, res) {
    const {
      url,
      format
    } = req.query;
    if (!url || !format) {
      return res.status(400).json({
        status: false,
        error: "Missing url or format"
      });
    }
    try {
      const result = await savetube.download(url, format);
      if (!result.status) {
        return res.status(result.code || 500).json(result);
      }
      return res.status(200).json({
        status: true,
        result: result.result
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};