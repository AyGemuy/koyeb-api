const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");
async function removeBg(image) {
  try {
    let img = await axios.get(image, {
      responseType: "arraybuffer"
    });
    let form = new FormData();
    form.append("files", Buffer.from(img.data), "file.jpg");
    let response = await axios("https://download1.imageonline.co/ajax_upload_file.php", {
      method: "POST",
      data: form,
      headers: {
        ...form.getHeaders(),
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        Origin: "https://imageonline.co",
        Referer: "https://imageonline.co/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      }
    });
    let data = response.data;
    let files = data.files[0];
    let name = files.name;
    let oname = files.old_name;
    let option = files.extension;
    let rembg = await axios("https://download1.imageonline.co/pngmaker.php", {
      method: "POST",
      data: new URLSearchParams({
        name: name,
        originalname: oname,
        option3: option,
        option4: "1"
      }).toString(),
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://imageonline.co",
        Referer: "https://imageonline.co/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      }
    });
    let html = rembg.data;
    let $ = cheerio.load(html);
    let images = $("img").attr("src");
    return {
      status: true,
      creator: "yudz",
      image: images
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      error: error.message || error
    };
  }
}
module.exports = {
  name: "removebg v2",
  desc: "Remove background gambar dari url",
  category: "Tools",
  params: ["url"],
  async run(req, res) {
    const url = req.query.url || req.body.url;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const result = await removeBg(url);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message || "Terjadi kesalahan"
      });
    }
  }
};