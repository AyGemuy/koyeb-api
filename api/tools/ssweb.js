const axios = require("axios");
module.exports = {
  name: "Ssweb",
  desc: "Full Page Screenshot of a Website",
  category: "Tools",
  params: ["url"],
  async run(req, res) {
    const url = req.query.url || req.body.url;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const payload = {
        query: `{Property{liveScreenshot(address: "${url}"){width height hash}}}`
      };
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: "https://fullpagescreencapture.com/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      };
      const response = await axios.post("https://api.hexometer.com/v2/ql", payload, {
        headers: headers
      });
      const resultData = response.data?.data?.Property?.liveScreenshot;
      if (resultData && resultData.hash) {
        return res.json({
          status: true,
          creator: "yudz",
          data: {
            title: `*Result From:* ${url}`,
            image: `https://fullpagescreencapture.com/screen/${resultData.hash}.jpg`
          }
        });
      } else {
        return res.status(404).json({
          status: false,
          creator: "yudz",
          data: {
            title: `404 : Not Found :(`,
            image: `https://telegra.ph/file/223c72d8fb2eb56bdba9c.jpg`
          }
        });
      }
    } catch (error) {
      console.error("Screenshot Error:", error);
      return res.status(500).json({
        status: false,
        error: error.message || error.toString()
      });
    }
  }
};