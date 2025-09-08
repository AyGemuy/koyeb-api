const axios = require("axios");
module.exports = {
  name: "Drakor",
  desc: "Search drama korea from drakorpedia.me",
  category: "Search",
  params: ["query"],
  async run(req, res) {
    try {
      const {
        query
      } = req.query;
      if (!query) return res.status(400).json({
        status: false,
        error: "Query is required"
      });
      const url = "https://drakorpedia.me/api/search?query=";
      const headers = {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      };
      const response = await axios.get(url + encodeURIComponent(query), {
        headers: headers
      });
      const data = response.data.data;
      const drakor = data.map(item => {
        const date = new Date(item.released_at);
        const formattedDate = date.toISOString().slice(0, 10);
        return {
          title: item.title,
          thumb: "https://drakorpedia.me" + item.poster,
          rilis: formattedDate,
          upload: item.updated_at,
          url: "https://drakorpedia.me/title/" + item.slug
        };
      });
      res.status(200).json({
        status: true,
        creator: "yudz",
        data: drakor
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};