const fs = require("fs");
const path = require("path");
module.exports = {
  name: "Total Api",
  desc: "Menampilkan total semua fitur di semua kategori",
  category: "User",
  async run(req, res) {
    try {
      const baseDir = path.join(__dirname, "..");
      const categories = fs.readdirSync(baseDir).filter(file => {
        const fullPath = path.join(baseDir, file);
        return fs.statSync(fullPath).isDirectory();
      });
      let total = 0;
      const detail = {};
      for (const category of categories) {
        const categoryDir = path.join(baseDir, category);
        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith(".js"));
        total += files.length;
        detail[category] = files.length;
      }
      res.json({
        status: true,
        total: total,
        perKategori: detail
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message
      });
    }
  }
};