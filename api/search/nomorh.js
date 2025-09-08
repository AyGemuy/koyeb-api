const axios = require("axios");
const cheerio = require("cheerio");
module.exports = {
  name: "Nomor Hoki",
  desc: "Cek nomor hoki berdasarkan primbon Bagua Shuzi",
  category: "Search",
  params: ["nomor"],
  async run({
    nomor
  }) {
    if (!nomor) throw new Error("Parameter nomor wajib diisi!");
    try {
      const response = await axios({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: "https://www.primbon.com/no_hoki_bagua_shuzi.php",
        data: new URLSearchParams({
          nomer: nomor,
          submit: "Submit!"
        }).toString()
      });
      const $ = cheerio.load(response.data);
      const fetchText = $("#body").text().trim();
      let result;
      try {
        result = {
          nomor_hp: fetchText.split("No. HP : ")[1].split("\n")[0].trim(),
          angka_bagua_shuzi: fetchText.split("Angka Bagua Shuzi : ")[1].split("\n")[0].trim(),
          energi_positif: {
            kekayaan: fetchText.split("Kekayaan = ")[1].split("\n")[0].trim(),
            kesehatan: fetchText.split("Kesehatan = ")[1].split("\n")[0].trim(),
            cinta: fetchText.split("Cinta/Relasi = ")[1].split("\n")[0].trim(),
            kestabilan: fetchText.split("Kestabilan = ")[1].split("\n")[0].trim(),
            persentase: fetchText.split("Kestabilan = ")[1].split("% = ")[1].split("ENERGI NEGATIF")[0].trim()
          },
          energi_negatif: {
            perselisihan: fetchText.split("Perselisihan = ")[1].split("\n")[0].trim(),
            kehilangan: fetchText.split("Kehilangan = ")[1].split("\n")[0].trim(),
            malapetaka: fetchText.split("Malapetaka = ")[1].split("\n")[0].trim(),
            kehancuran: fetchText.split("Kehancuran = ")[1].split("\n")[0].trim(),
            persentase: fetchText.split("Kehancuran = ")[1].split("% = ")[1].split("\n")[0].trim()
          },
          notes: fetchText.split("* ")[1].split("Masukan Nomor HP Anda")[0].trim()
        };
      } catch {
        result = `Nomor "${nomor}" tidak valid atau data tidak lengkap.`;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
};