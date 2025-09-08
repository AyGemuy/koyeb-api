const axios = require("axios");
const fetchJson = require("../../lib/fetcher").default;
module.exports = {
  name: "Pinterest",
  desc: "Search image from Pinterest with fallback APIs",
  category: "Search",
  params: ["q", "count"],
  async run(req, res) {
    const {
      q,
      count
    } = req.query;
    if (!q) return res.status(400).json({
      status: false,
      error: "Query is required"
    });
    let limit = 10;
    if (count) {
      const parsed = parseInt(count);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 50) limit = parsed;
    }
    try {
      const result = await caripinterest(q, limit);
      if (!result.length) throw new Error("No results");
      res.status(200).json({
        status: true,
        result: result
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};
async function pinterests(query, limit) {
  const {
    data
  } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/`, {
    params: {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query: query,
          scope: "pins",
          no_fetch_context_on_resource: false
        },
        context: {}
      })
    }
  });
  const results = data.resource_response.data.results.filter(v => v.images?.orig);
  return results.slice(0, limit).map(result => ({
    link: "https://id.pinterest.com/pin/" + result.id,
    directLink: result.images.orig.url
  }));
}
async function caripinterest(query, limit) {
  try {
    let res = await pinterests(query, limit);
    if (!res.length) throw "Scraper gagal";
    return res;
  } catch {
    try {
      let apiUrl = `https://api.nekorinn.my.id/search/pinterest?q=${encodeURIComponent(query)}&limit=${limit}`;
      let response = await fetchJson(apiUrl);
      if (!response.status || !response.result.length) throw "API utama gagal";
      return response.result.slice(0, limit).map(item => ({
        link: item.link,
        directLink: item.imageUrl
      }));
    } catch {
      try {
        let url = `https://api.ryzendesu.vip/api/search/pinterest?query=${encodeURIComponent(query)}&limit=${limit}`;
        let res = await fetchJson(url);
        if (!res.length) throw "API cadangan 1 gagal";
        return res.slice(0, limit).map(item => ({
          link: item.link,
          directLink: item.directLink
        }));
      } catch {
        try {
          let url = `https://restapi.rizk.my.id/pinterest?query=${encodeURIComponent(query)}&apikey=free&limit=${limit}`;
          let res = await fetchJson(url);
          if (!res.status || !res.result.length) throw "RizkAPI gagal";
          return res.result.slice(0, limit).map(item => ({
            link: item.link,
            directLink: item.directLink
          }));
        } catch {
          try {
            let url = `https://api.ownblox.biz.id/api/pinterest?q=${encodeURIComponent(query)}&limit=${limit}`;
            let res = await fetchJson(url);
            if (!res.status || !res.results.length) throw "Ownblox gagal";
            return res.results.slice(0, limit).map(item => ({
              link: item.source,
              directLink: item.image
            }));
          } catch {
            try {
              let url = `https://api.vreden.my.id/api/pinterest?query=${encodeURIComponent(query)}&limit=${limit}`;
              let res = await fetchJson(url);
              if (!res.status || !res.result.length) throw "Vreden 1 gagal";
              return res.result.slice(0, limit).map(url => ({
                link: "https://www.pinterest.com",
                directLink: url
              }));
            } catch {
              try {
                let url = `https://api.vreden.my.id/api/search/pinterest?query=${encodeURIComponent(query)}&limit=${limit}`;
                let res = await fetchJson(url);
                if (!res.status || !res.result?.pins?.length) throw "Vreden 2 gagal";
                return res.result.pins.slice(0, limit).map(pin => ({
                  link: pin.pin_url,
                  directLink: pin.media?.images?.orig?.url
                }));
              } catch (err) {
                console.error("Semua API gagal:", err);
                return [];
              }
            }
          }
        }
      }
    }
  }
}