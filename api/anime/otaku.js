const axios = require("axios");
const cheerio = require("cheerio");
async function otakuDesu(query) {
  try {
    let response = await axios.get(`https://otakudesu.cloud/?s=${encodeURIComponent(query)}&post_type=anime`);
    let html = response.data;
    let $ = cheerio.load(html);
    let h2 = $("h2");
    let a = h2.find("a");
    let otaku = [];
    a.each((index, element) => {
      let url = $(element).attr("title");
      let title = $(element).text();
      otaku.push({
        url: url,
        title: title
      });
    });
    if (otaku.length === 0) throw new Error("Anime tidak ditemukan");
    let getInfo = await axios.get(otaku[0].url);
    let htmlInfo = getInfo.data;
    let _$ = cheerio.load(htmlInfo);
    let foto = _$(".attachment-post-thumbnail").attr("src");
    let desu = [];
    _$("p span").each((i, el) => {
      let nuy = _$(el).text().trim();
      let info = nuy.split(" ");
      let infos = info.slice(1).join(" ");
      desu.push({
        infos: infos
      });
    });
    let urls = [];
    _$("li span a").each((i, el) => {
      if (i < 4) {
        let url = _$(el).attr("href");
        let eps = _$(el).text();
        urls.push({
          url: url,
          eps: eps
        });
      }
    });
    let uploads = [];
    _$("li span.zeebr").each((i, el) => {
      if (i < 4) {
        let upload = _$(el).text();
        uploads.push({
          upload: upload
        });
      }
    });
    let desk = _$(".sinopc").text();
    let result = {
      status: true,
      creator: "yudz",
      foto: foto,
      info: {
        judul: desu[0]?.infos || "",
        japanese: desu[1]?.infos || "",
        skor: desu[2]?.infos || "",
        produser: desu[3]?.infos || "",
        tipe: desu[4]?.infos || "",
        status: desu[5]?.infos || "",
        totalEps: desu[6]?.infos.split(" ").slice(1).join(" ") || "",
        durasi: desu[7]?.infos || "",
        tanggalRilis: desu[8]?.infos.split(" ").slice(1).join(" ") || "",
        studio: desu[9]?.infos || "",
        genre: desu[10]?.infos || "",
        deskripsi: desk.trim()
      },
      episode: urls.map((u, i) => ({
        url: u.url,
        eps: u.eps,
        rilis: uploads[i]?.upload || ""
      }))
    };
    return result;
  } catch (error) {
    console.error(error);
    return {
      status: false,
      error: error.message
    };
  }
}
module.exports = {
  name: "Otaku Desu",
  desc: "Search anime info from otakudesu.cloud",
  category: "Anime",
  params: ["query"],
  async run(req, res) {
    const query = req.query.query || req.body.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query wajib diisi!"
    });
    try {
      const result = await otakuDesu(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message || "Terjadi kesalahan"
      });
    }
  }
};