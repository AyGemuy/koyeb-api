const axios = require("axios");
const client_id = "f97b33bf590840f7ab31e7d372b1a1bf";
const client_secret = "d700cceafc7c4de483b2ec3850f97a6a";
const authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded"
  },
  data: "grant_type=client_credentials"
};
async function getAccessToken() {
  try {
    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers
    });
    if (response.status === 200) {
      return response.data.access_token;
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return null;
  }
}

function convertDuration(durationMs) {
  const seconds = Math.floor(durationMs / 1e3 % 60);
  const minutes = Math.floor(durationMs / (1e3 * 60) % 60);
  const hours = Math.floor(durationMs / (1e3 * 60 * 60) % 24);
  let result = "";
  if (hours > 0) result += hours + " jam ";
  if (minutes > 0) result += minutes + " menit ";
  if (seconds > 0) result += seconds + " detik";
  return result.trim();
}
async function spotifySearch(query, limit = 10, offset = 0, market = "id") {
  const token = await getAccessToken();
  if (!token) return {
    status: false,
    message: "Gagal mendapatkan access token"
  };
  const searchUrl = `https://api.spotify.com/v1/search?limit=${limit}&offset=${offset}&q=${encodeURIComponent(query)}&type=track&market=${market}`;
  try {
    const spoti = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = spoti.data.tracks.items;
    if (!items.length) return {
      status: false,
      message: `${query} tidak ditemukan`
    };
    const result = items.map(item => {
      const album = item.album;
      return {
        title: item.name,
        artis: item.artists.map(a => a.name).join(", "),
        url_artis: item.artists[0].external_urls.spotify,
        rilis: album.release_date,
        populer: item.popularity + "%",
        durasi: convertDuration(item.duration_ms),
        image: album.images?.[1]?.url || null,
        preview: item.preview_url,
        urls: item.external_urls.spotify
      };
    });
    return {
      status: true,
      creator: "yudz",
      data: result
    };
  } catch (error) {
    console.error("Spotify Search Error:", error.response?.data || error.message);
    return {
      status: false,
      message: "Gagal memuat data dari Spotify"
    };
  }
}
module.exports = {
  name: "Spotify v2",
  desc: "Search lagu dari Spotify berdasarkan query",
  category: "Search",
  params: ["query"],
  async run(req, res) {
    const query = req.query.query || req.body.query;
    if (!query) return res.status(400).json({
      status: false,
      message: "Parameter query wajib diisi!"
    });
    const result = await spotifySearch(query);
    res.json(result);
  }
};