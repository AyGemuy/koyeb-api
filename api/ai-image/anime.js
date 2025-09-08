const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  v4: uuidv4
} = require("uuid");
module.exports = {
  name: "Img2Anime",
  desc: "Convert image URL to anime style images",
  category: "AI Image",
  params: ["url"],
  async run(req, res) {
    try {
      const {
        url
      } = req.query;
      if (!url) return res.status(400).json({
        status: false,
        error: "URL is required"
      });
      const imageResponse = await axios.get(url, {
        responseType: "arraybuffer"
      });
      const mimeType = imageResponse.headers["content-type"];
      const base64Image = Buffer.from(imageResponse.data).toString("base64");
      const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;
      const data = JSON.stringify({
        image: base64ImageUrl
      });
      const config = {
        method: "POST",
        url: "https://www.drawever.com/api/tools/process",
        headers: {
          "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
          Accept: "application/json",
          "Content-Type": "application/json",
          "accept-language": "id-ID",
          referer: "https://www.drawever.com/ai/photo-to-anime?start=1736212737985",
          path: "/ai/photo-to-anime",
          origin: "https://www.drawever.com",
          "alt-used": "www.drawever.com",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          priority: "u=0",
          te: "trailers",
          Cookie: "_ga_H15YQYJC6R=GS1.1.1736212732.1.0.1736212732.0.0.0; _ga=GA1.1.1471909988.1736212732"
        },
        data: data
      };
      const api = await axios.request(config);
      const images = api.data;
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(500).json({
          status: false,
          error: "No images returned from API"
        });
      }
      if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
        fs.mkdirSync(path.join(process.cwd(), "tmp"));
      }
      const savedPaths = [];
      images.forEach(base64Image => {
        const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const fileType = matches[1];
          const base64Data = matches[2];
          const fileExtension = fileType.split("/")[1];
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = path.join(process.cwd(), "tmp", fileName);
          fs.writeFileSync(filePath, base64Data, "base64");
          savedPaths.push(filePath);
        }
      });
      res.status(200).json({
        status: true,
        savedPaths: savedPaths
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};