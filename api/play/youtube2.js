const axios = require("axios");
const yts = require("yt-search");
const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error("Format tidak didukung, cek daftar format yang tersedia.");
    }
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    };
    try {
      const response = await axios.request(config);
      if (response.data && response.data.success) {
        const {
          id
        } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return {
          downloadUrl: downloadUrl
        };
      } else {
        throw new Error("Gagal mengambil detail video.");
      }
    } catch (error) {
      throw error;
    }
  },
  cekProgress: async id => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    };
    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1e3) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5e3));
      }
    } catch (error) {
      throw error;
    }
  }
};
const ytdl = async query => {
  try {
    const search = await yts(query);
    const video = search.all[0];
    if (!video) {
      throw new Error("Lagu yang Anda cari tidak ditemukan.");
    }
    const result = await ddownr.download(video.url, "mp3");
    return result.downloadUrl;
  } catch (error) {
    throw new Error(`Terjadi kesalahan: ${error.message}`);
  }
};
module.exports = {
  name: "Youtube v2",
  desc: "Cari dan download lagu dari YouTube (mp3)",
  category: "Play",
  params: ["q"],
  async run(req, res) {
    const {
      q
    } = req.query;
    if (!q) return res.status(400).json({
      status: false,
      message: 'Parameter "q" wajib diisi.'
    });
    try {
      const url = await ytdl(q);
      res.json({
        status: true,
        creator: "yudz",
        data: {
          audio: url
        }
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Gagal memproses permintaan.",
        error: err.message
      });
    }
  }
};