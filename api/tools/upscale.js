const fs = require("fs");
const path = require("path");
const axios = require("axios");

function formatSize(size) {
  function round(value, precision = 0) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  }
  const kb = 1024,
    mb = kb * kb,
    gb = kb * mb;
  if (size < kb) return size + "B";
  else if (size < mb) return round(size / kb, 1) + "KB";
  else if (size < gb) return round(size / mb, 1) + "MB";
  else return round(size / gb, 1) + "GB";
}
async function upscaleImage(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer"
  });
  const buffer = Buffer.from(res.data);
  const ext = path.extname(url).split("?")[0].slice(1) || "jpg";
  const mime = ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "application/octet-stream";
  const fileName = Math.random().toString(36).slice(2, 8) + "." + ext;
  const {
    data
  } = await axios.post("https://pxpic.com/getSignedUrl", {
    folder: "uploads",
    fileName: fileName
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  await axios.put(data.presignedUrl, buffer, {
    headers: {
      "Content-Type": mime
    }
  });
  const fileUrl = "https://files.fotoenhancer.com/uploads/" + fileName;
  const result = await axios.post("https://pxpic.com/callAiFunction", new URLSearchParams({
    imageUrl: fileUrl,
    targetFormat: "png",
    needCompress: "no",
    imageQuality: "100",
    compressLevel: "6",
    fileOriginalExtension: "png",
    aiFunction: "upscale",
    upscalingLevel: ""
  }).toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded",
      "accept-language": "id-ID"
    }
  });
  const size = formatSize(buffer.length);
  return {
    status: 200,
    success: true,
    result: {
      size: size,
      imageUrl: result.data.resultImageUrl
    }
  };
}
module.exports = {
  name: "Upscale",
  desc: "Upscale gambar dengan AI",
  category: "Tools",
  params: ["url"],
  async run(req, res) {
    const {
      url,
      apikey
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const result = await upscaleImage(url);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};