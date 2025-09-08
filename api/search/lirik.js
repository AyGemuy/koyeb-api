const axios = require("axios");
const cheerio = require("cheerio");
module.exports = {
  name: "Lirik",
  desc: "Cari lirik lagu dari Genius",
  category: "Search",
  params: ["query"],
  async run(req, res) {
    const query = req.query.query || req.body.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query tidak boleh kosong!"
    });
    try {
      const geniusRes = await axios.get(`http://api.genius.com/search?q=${encodeURIComponent(query)}&access_token=QM9gJBlJNIkeljJO2ZE_--FOHQh_D63QxxoOGjS5UQVyugkVxSVl8e8yYwUJadRy`);
      const hits = geniusRes.data?.response?.hits;
      if (hits.length > 0) {
        const song = hits[0].result;
        const lyricRes = await axios({
          method: "GET",
          url: "https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/",
          params: {
            id: song.id
          },
          headers: {
            "x-rapidapi-key": "6d76823bdbmsh03d32d092d169b8p165006jsn3fdc9f9b758f",
            "x-rapidapi-host": "genius-song-lyrics1.p.rapidapi.com"
          }
        });
        const $ = cheerio.load(lyricRes.data.lyrics.lyrics.body.html);
        const lyricsText = $("p").text().trim();
        return res.json({
          status: true,
          creator: "yudz",
          data: {
            artis: song.artist_names,
            image: song.header_image_thumbnail_url,
            title: song.full_title,
            rilis: song.release_date_for_display || "-",
            lirik: lyricsText
          }
        });
      } else {
        return res.json({
          status: true,
          creator: "yudz",
          data: {
            artis: "No Name",
            image: "https://telegra.ph/file/e7a4414620ce6da03bb02.jpg",
            title: "Not Found 404 Syngg",
            rilis: "28 Desember (Ultah Nuy)",
            lirik: "Tidak Ditemukan!"
          }
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        error: error.message || error.toString()
      });
    }
  }
};