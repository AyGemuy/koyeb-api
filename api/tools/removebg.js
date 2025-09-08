const axios = require("axios");
module.exports = {
  name: "Removebg",
  desc: "Hapus background gambar otomatis",
  category: "Tools",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const flow = await axios.get(`https://flowfalcon.dpdns.org/imagecreator/removebg?url=${encodeURIComponent(url)}`);
      if (flow.data?.result) return res.status(200).json(flow.data);
    } catch (_) {}
    try {
      const neko = await axios.get(`https://api.nekorinn.my.id/tools/removebg?imageUrl=${encodeURIComponent(url)}`);
      if (neko.data?.result) return res.status(200).json(neko.data);
    } catch (_) {}
    try {
      const spt = await axios.get(`https://api.siputzx.my.id/api/iloveimg/removebg?image=${encodeURIComponent(url)}&scale=2`, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", spt.headers["content-type"] || "image/png");
      return res.end(spt.data);
    } catch (_) {}
    return res.status(500).json({
      status: false,
      error: "Semua API removebg gagal diakses."
    });
  }
};