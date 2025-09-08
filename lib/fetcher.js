const axios = require("axios");
async function fetchJson(url, options = {}) {
  try {
    const res = await axios.get(url, options);
    return res.data;
  } catch (err) {
    return {
      status: false,
      error: err.message || "Fetch failed"
    };
  }
}
exports.default = fetchJson;