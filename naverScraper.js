const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

// Challenge proxy (still failing, but documented)
const proxy = "http://td-customer-mrscraperTrial-country-kr:P3nNRQ8C2@6n8xhsmh.as.thordata.net:9999";

// Example Naver product page (from test PDF)
const url = "https://smartstore.naver.com/rainbows9030/products/11102379008";

// Pool of User-Agents (pretending to be different browsers/devices)
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:118.0) Gecko/20100101 Firefox/118.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/119.0.0.0 Safari/537.36",
];

// Retry logic with random User-Agent + delay
async function fetchWithRetry(url, retries = 5) {
  for (let i = 1; i <= retries; i++) {
    try {
      // Pick a random User-Agent
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
        // random delay between 3–10s
        const delay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}

(async () => {
  try {
    const html = await fetchWithRetry(url);
    console.log("Final HTML length:", html.length);
  } catch (err) {
    console.error("Scraping ultimately failed:", err.message);
  }
})();
