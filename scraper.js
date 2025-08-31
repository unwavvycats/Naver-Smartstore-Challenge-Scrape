const axios = require("axios");
const cheerio = require("cheerio");

(async () => {
  try {
    const url = "https://quotes.toscrape.com/";
    console.log(`Fetching: ${url}`);

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let quotes = [];
    $(".quote").each((i, el) => {
      const text = $(el).find(".text").text();
      const author = $(el).find(".author").text();
      quotes.push({ text, author });
    });

    console.log("✅ Scraped quotes:", quotes);
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
  }
})();
