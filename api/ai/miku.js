const axios = require("axios");
const FormData = require("form-data");
module.exports = {
  name: "Miku",
  desc: "Chat dengan Miku Nakano",
  category: "AI",
  params: ["text"],
  async run(req, res) {
    try {
      const {
        text
      } = req.query;
      if (!text) return res.status(400).json({
        status: false,
        error: "Text is required"
      });
      const logic = "Berbicaralah seperti Miku Nakano dari Gotoubun no Hanayome: pemalu, lembut, dan tertarik pada sejarah Jepang, terutama era Sengoku.";
      const form = new FormData();
      form.append("content", text);
      form.append("model", "@custom/models");
      form.append("system", logic);
      const {
        data
      } = await axios.post("https://mind.hydrooo.web.id/v1/chat/", form, {
        headers: {
          ...form.getHeaders()
        }
      });
      res.status(200).json({
        status: true,
        character: "Miku",
        result: data.result
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};