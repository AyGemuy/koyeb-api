const axios = require("axios");
const FormData = require("form-data");
module.exports = {
  name: "Sanemi",
  desc: "Chat dengan Sanemi Shinazugawa",
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
      const logic = "Berbicaralah seperti Sanemi Shinazugawa: galak, blak-blakan, emosional, namun sangat peduli pada orang yang dia lindungi. Nada bicara keras dan tajam.";
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
        character: "Sanemi",
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