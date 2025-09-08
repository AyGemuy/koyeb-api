const axios = require("axios");

function generateRandomRid() {
  return Math.random().toString(36).substring(2, 15);
}
module.exports = {
  name: "lepton",
  desc: "Chat dengan Lepton AI",
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
      const url = "https://search.lepton.run/api/query";
      const rid = generateRandomRid();
      const requestData = {
        query: query,
        rid: rid
      };
      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      res.status(200).json({
        status: true,
        data: response.data
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.response ? error.response.data : error.message
      });
    }
  }
};