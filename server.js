// For Server side 
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// Route Test
app.get ('/', (req,res) => {
    res.send("Naver Scrape API Runing");
});

app.get("/scrape", async (req, res) => {
  try {
    const url = "https://quotes.toscrape.com/";
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    let quotes = [];
    $(".quote").each((i, el) => {
      quotes.push({
        text: $(el).find(".text").text(),
        author: $(el).find(".author").text(),
      });
    });

    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});