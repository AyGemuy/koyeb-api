const axios = require("axios");
const cheerio = require("cheerio");
module.exports = {
  name: "Anime Search",
  desc: "Cari anime dari anime-indo.lol",
  category: "Anime",
  params: ["q"],
  async run(req, res) {
    const {
      q
    } = req.query;
    if (!q) return res.status(400).json({
      status: false,
      error: "Parameter q diperlukan"
    });
    try {
      const getData = await axios.get(`https://anime-indo.lol/search.php?q=${encodeURIComponent(q)}`);
      const $ = cheerio.load(getData.data);
      const web = $("head link").attr("href");
      if (!web) throw new Error("Tidak dapat menemukan link halaman");
      const response = await axios.get(web);
      const _$ = cheerio.load(response.data);
      const td = _$(".videsc");
      const ipah = td.find("a");
      const results = [];
      ipah.each((i, el) => {
        const url = _$(el).attr("href");
        const title = _$(el).text();
        results.push({
          url: "https://anime-indo.lol" + url,
          title: title.trim()
        });
      });
      res.json({
        status: true,
        creator: "yudz",
        data: results
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message || "Terjadi kesalahan"
      });
    }
  }
};