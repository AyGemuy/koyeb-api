const axios = require("axios");
module.exports = {
  name: "Brat",
  desc: "Buat gambar Brat Style dari teks",
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
    const urls = [`https://api.nekorinn.my.id/maker/brat-v2?text=${encodeURIComponent(q)}`, `https://flowfalcon.dpdns.org/imagecreator/brat?text=${encodeURIComponent(q)}`, `https://www.ikyiizyy.my.id/imagecreator/brat?apikey=new&text=${encodeURIComponent(q)}`, `https://api.yupradev.biz.id/api/image/brat?text=${encodeURIComponent(q)}`, `https://www.laurine.site/api/generator/brat?text=${encodeURIComponent(q)}`, `https://jerofc.my.id/api/brat?text=${encodeURIComponent(q)}`, `https://api.crafters.biz.id/maker/brat?text=${encodeURIComponent(q)}`, `https://skyzxu-brat.hf.space/brat?text=${encodeURIComponent(q)}`, `https://vor-apis.biz.id/api/bratv1?q==${encodeURIComponent(q)}`, `https://api.ownblox.biz.id/api/brat?text=${encodeURIComponent(q)}`, `https://api.agungny.my.id/api/bratv1?q=${encodeURIComponent(q)}`, `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(q)}&isVideo=false&delay=500`, `https://clairity-nine.vercel.app/api/brat?text=${encodeURIComponent(q)}`, `https://apikey.moontech.web.id/api/tools/bratgenerator?text=${encodeURIComponent(q)}`];
    for (const url of urls) {
      try {
        const resImg = await axios.get(url, {
          responseType: "arraybuffer"
        });
        res.setHeader("Content-Type", resImg.headers["content-type"]);
        return res.end(resImg.data);
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