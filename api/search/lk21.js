const axios = require("axios");
const cheerio = require("cheerio");
async function layarKaca(query) {
  try {
    const lk = await axios.get(`https://tv3.lk21official.mom/search.php?s=${encodeURIComponent(query)}`);
    const html = lk.data;
    const $ = cheerio.load(html);
    const films = [];
    $(".search-item").each((i, element) => {
      const title = $(element).find("h3 a").text().trim();
      const link = $(element).find("h3 a").attr("href");
      const poster = $(element).find(".search-poster img").attr("src");
      const director = $(element).find('p:contains("Sutradara:")').text().replace("Sutradara:", "").trim();
      const stars = $(element).find('p:contains("Bintang:")').text().replace("Bintang:", "").trim();
      films.push({
        judul: title,
        link: "https://tv3.lk21official.mom" + link,
        thumbnail: "https://tv3.lk21official.mom" + poster,
        sutradara: director,
        aktor: stars
      });
    });
    return {
      status: true,
      creator: "yudz",
      data: {
        film: films
      }
    };
  } catch (error) {
    return {
      status: false,
      creator: "yudz",
      message: "Gagal mengambil data film",
      error: error.message
    };
  }
}
module.exports = {
  name: "LK21",
  desc: "Search film di lk21official.mom",
  category: "Search",
  params: ["q"],
  async run(req, res) {
    const {
      q
    } = req.query;
    if (!q) return res.status(400).json({
      status: false,
      message: 'Parameter "q" tidak ditemukan.'
    });
    try {
      const result = await layarKaca(q);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err.message
      });
    }
  }
};