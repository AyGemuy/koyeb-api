const axios = require("axios");
const qs = require("qs");
const {
  fromBuffer
} = require("file-type");
const allowedModels = ["removebg", "enhance", "upscale", "restore", "colorize"];
const pxpic = {
  upload: async buffer => {
    const fileInfo = await fromBuffer(buffer);
    if (!fileInfo?.ext || !fileInfo?.mime) throw new Error("File tidak valid atau gagal dibaca dari buffer.");
    const fileName = `${Date.now()}.${fileInfo.ext}`;
    const folder = "uploads";
    const response = await axios.post("https://pxpic.com/getSignedUrl", {
      folder: folder,
      fileName: fileName
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const {
      presignedUrl
    } = response.data;
    await axios.put(presignedUrl, buffer, {
      headers: {
        "Content-Type": fileInfo.mime
      }
    });
    return `https://files.fotoenhancer.com/uploads/${fileName}`;
  },
  create: async (buffer, tool) => {
    if (!allowedModels.includes(tool)) {
      return {
        error: `Model tidak valid. Gunakan salah satu: ${allowedModels.join(", ")}`
      };
    }
    const url = await pxpic.upload(buffer);
    const data = qs.stringify({
      imageUrl: url,
      targetFormat: "png",
      needCompress: "no",
      imageQuality: "100",
      compressLevel: "6",
      fileOriginalExtension: "png",
      aiFunction: tool,
      upscalingLevel: ""
    });
    const config = {
      method: "POST",
      url: "https://pxpic.com/callAiFunction",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data
    };
    const response = await axios.request(config);
    return response.data;
  }
};
module.exports = {
  name: "Pxpic",
  desc: "AI Image Tool: removebg, enhance, restore, dll",
  category: "Tools",
  params: ["model", "url"],
  run: async (req, res) => {
    const {
      model: tool,
      url
    } = req.query;
    if (!tool || !url) return res.status(400).json({
      status: false,
      error: "Parameter model dan url wajib diisi."
    });
    if (!allowedModels.includes(tool)) {
      return res.status(400).json({
        status: false,
        error: `Model tidak valid. Pilih: ${allowedModels.join(", ")}`
      });
    }
    try {
      const imgRes = await axios.get(url, {
        responseType: "arraybuffer"
      });
      const buffer = Buffer.from(imgRes.data);
      const result = await pxpic.create(buffer, tool);
      return res.status(200).json({
        status: true,
        result: result
      });
    } catch (e) {
      console.error("Pxpic error:", e?.response?.data || e.message);
      return res.status(500).json({
        status: false,
        error: e.message
      });
    }
  }
};