const axios = require("axios");
module.exports = {
  name: "Spotify",
  desc: "Cari lagu Spotify dari query",
  category: "Search",
  params: ["query", "count"],
  async run(req, res) {
    const {
      query,
      count
    } = req.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query wajib diisi!"
    });
    try {
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
      const search = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${count || 5}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tracks = search.data.tracks.items;
      if (!tracks.length) return res.status(404).json({
        status: false,
        error: "Tidak ditemukan hasil."
      });
      return res.status(200).json({
        status: true,
        result: tracks.map(track => ({
          title: track.name,
          url: track.external_urls.spotify,
          duration: track.duration_ms,
          artist: track.artists.map(a => a.name).join(", "),
          album: track.album.name,
          image: track.album.images[0]?.url
        }))
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};