const express = require("express");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const app = express();
const PORT = 3000;

// Challenge proxy
const proxy = "http://td-customer-mrscraperTrial-country-kr:P3nNRQ8C2@6n8xhsmh.as.thordata.net:9999";

// Pool of User-Agents
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Chrome...",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X)...Safari...",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64)...Firefox...",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Edge...",
];

// Retry + backoff + UA rotation
async function fetchWithRetry(url, retries = 5) {
  for (let i = 1; i <= retries; i++) {
    try {
      const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      console.log(`🌀 Attempt ${i} with UA: ${userAgent.slice(0, 30)}...`);

      const agent = new HttpsProxyAgent(proxy);
      const res = await axios.get(url, {
        httpsAgent: agent,
        headers: { "User-Agent": userAgent },
      });

      console.log(`✅ Success on attempt ${i}`);
      return res.data;
    } catch (err) {
      console.error(`❌ Attempt ${i} failed: ${err.message}`);
      if (i < retries) {
        const delay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}

app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Naver Scraper API is running!</h2>
    <p>Usage: <code>/scrape?url=https://quotes.toscrape.com</code></p>
  `);
});

// Scrape endpoint
app.get("/scrape", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const html = await fetchWithRetry(targetUrl);
    res.send({ success: true, length: html.length, snippet: html.slice(0, 500) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
