const axios = require("axios");
module.exports = {
  name: "Brat Video",
  desc: "Buat video Brat Style dari teks",
  category: "Maker",
  params: ["q"],
  async run(req, res) {
    const {
      q
    } = req.query;
    if (!q) return res.status(400).json({
      status: false,
      error: "Parameter q wajib diisi!"
    });
    const apis = [`https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(q)}`, `https://rest-api.nazirganz.space/maker/brat?text=${encodeURIComponent(q)}`, `https://api.yupradev.biz.id/api/video/bratv?text=${encodeURIComponent(q)}`, `https://api.ryzendesu.vip/api/image/brat/animated?text=${encodeURIComponent(q)}`, `https://restapi.rizk.my.id/bardvidio?text=${encodeURIComponent(q)}&apikey=free`, `https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(q)}`];
    for (const url of apis) {
      try {
        const result = await axios.get(url, {
          responseType: "arraybuffer"
        });
        res.setHeader("Content-Type", result.headers["content-type"]);
        return res.end(result.data);
      } catch (err) {
        continue;
      }
    }
    res.status(500).json({
      status: false,
      error: "Semua API gagal diakses."
    });
  }
};