const axios = require("axios");
const FormData = require("form-data");
const {
  fromBuffer
} = require("file-type");
async function uploadToCatbox(buffer) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, "image.jpg");
  const response = await axios.post("https://catbox.moe/user/api.php", form, {
    headers: form.getHeaders()
  });
  return response.data;
}
module.exports = {
  name: "Smeme",
  desc: "Generate meme dari gambar (otomatis upload jika perlu)",
  category: "Maker",
  params: ["url", "atas", "bawah"],
  async run(req, res) {
    const {
      url,
      atas,
      bawah
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      let imageUrl = url;
      if (!/\.(jpg|jpeg|png|webp)$/i.test(url)) {
        const imgRes = await axios.get(url, {
          responseType: "arraybuffer"
        });
        const buffer = Buffer.from(imgRes.data);
        const fileType = await fromBuffer(buffer);
        if (!fileType?.mime?.startsWith("image/")) {
          return res.status(400).json({
            status: false,
            error: "URL bukan gambar valid."
          });
        }
        imageUrl = await uploadToCatbox(buffer);
      }
      const memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas || "-")}/${encodeURIComponent(bawah || "-")}.jpg?background=${encodeURIComponent(imageUrl)}`;
      const result = await axios.get(memeUrl, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", result.headers["content-type"] || "image/jpeg");
      res.setHeader("Content-Disposition", "inline; filename=smeme.jpg");
      res.end(result.data);
    } catch (err) {
      console.error("Memegen error:", err?.response?.data || err.message);
      return res.status(500).json({
        status: false,
        error: err?.response?.data?.message || err.message
      });
    }
  }
};