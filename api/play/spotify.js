const axios = require("axios");
module.exports = {
  name: "Spotify",
  desc: "Cari dan unduh lagu dari Spotify (MP3)",
  category: "Play",
  params: ["query"],
  async run(req, res) {
    const {
      query
    } = req.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query wajib diisi!"
    });
    try {
      let spotifyUrl = query;
      const isSpotifyUrl = /https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/.test(query);
      if (!isSpotifyUrl) {
        const client_id = "acc6302297e040aeb6e4ac1fbdfd62c3";
        const client_secret = "0e8439a1280a43aba9a5bc0a16f3f009";
        const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
        const tokenRes = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
          headers: {
            Authorization: "Basic " + basic,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        const token = tokenRes.data.access_token;
        const searchSpotify = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const item = searchSpotify.data.tracks.items[0];
        if (!item) throw new Error("Lagu tidak ditemukan di Spotify");
        spotifyUrl = item.external_urls.spotify;
      }
      const info = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(spotifyUrl)}`, {
        headers: {
          accept: "application/json",
          Referer: "https://spotifydownload.org/"
        }
      });
      const {
        id,
        gid,
        name,
        artists,
        duration_ms,
        image
      } = info.data.result;
      const convert = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`, {
        headers: {
          accept: "application/json",
          Referer: "https://spotifydownload.org/"
        }
      });
      const mp3Url = "https://api.fabdl.com" + convert.data.result.download_url;
      const file = await axios.get(mp3Url, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `inline; filename="${name}.mp3"`);
      return res.end(file.data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};