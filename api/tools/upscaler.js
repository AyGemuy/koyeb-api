const axios = require("axios");
const FormData = require("form-data");
module.exports = {
  name: "Upscaler",
  desc: "Upscale Image (2x) using imgupscaler.com",
  category: "Tools",
  params: ["url"],
  async run(req, res) {
    const url = req.query.url || req.body.url;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const downloadResponse = await axios.get(url, {
        responseType: "arraybuffer"
      });
      const formData = new FormData();
      formData.append("myfile", Buffer.from(downloadResponse.data), "file.jpg");
      formData.append("scaleRadio", "2");
      formData.append("isLogin", "0");
      const uploadResponse = await axios.post("https://get1.imglarger.com/api/Upscaler/Upload", formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          Connection: "keep-alive",
          Host: "get1.imglarger.com",
          Origin: "https://imgupscaler.com",
          Referer: "https://imgupscaler.com/",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        }
      });
      const code = uploadResponse.data?.data?.code;
      if (!code) return res.status(500).json({
        status: false,
        error: "Gagal mendapatkan kode hasil!"
      });
      const statusCheck = await axios.post("https://get1.imglarger.com/api/Upscaler/CheckStatus", {
        code: code,
        isLogin: "0",
        scaleRasio: "2"
      }, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          Connection: "keep-alive",
          Host: "get1.imglarger.com",
          Origin: "https://imgupscaler.com",
          Referer: "https://imgupscaler.com/",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        }
      });
      if (statusCheck.data.code === 200) {
        await new Promise(resolve => setTimeout(resolve, 5e3));
        return res.json({
          status: true,
          creator: "yudz",
          imageUrl: `https://get1.imglarger.com/upscaler/results/${code}_2x.jpg`
        });
      } else {
        return res.status(500).json({
          status: false,
          error: "Upscaling gagal atau masih diproses."
        });
      }
    } catch (err) {
      console.error("Upscaler Error:", err);
      return res.status(500).json({
        status: false,
        error: err.message || err.toString()
      });
    }
  }
};