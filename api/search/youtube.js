const yts = require("yt-search");
module.exports = {
  name: "Youtube",
  desc: "Cari video YouTube berdasarkan kata kunci",
  category: "Search",
  params: ["query", "count"],
  async run(req, res) {
    const {
      query,
      count
    } = req.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query wajib diisi!"
    });
    try {
      const result = await yts(query);
      let videos = result.videos;
      const limit = parseInt(count);
      if (!isNaN(limit) && limit > 0) {
        videos = videos.slice(0, limit);
      }
      const output = videos.map(video => ({
        title: video.title,
        url: video.url,
        timestamp: video.timestamp,
        duration: video.duration.seconds,
        views: video.views,
        published: video.ago,
        author: video.author.name,
        channelId: video.author.url,
        thumbnail: video.thumbnail
      }));
      return res.status(200).json({
        status: true,
        result: output
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};