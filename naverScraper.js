const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

// Challenge proxy (still fails, but kept for documentation)
const proxy = "http://td-customer-mrscraperTrial-country-kr:P3nNRQ8C2@6n8xhsmh.as.thordata.net:9999";

// Example Naver product page (from test PDF)
const url = "https://smartstore.naver.com/rainbows9030/products/11102379008";

// Retry logic with random backoff
async function fetchWithRetry(url, retries = 5) {
  for (let i = 1; i <= retries; i++) {
    try {
      const agent = new HttpsProxyAgent(proxy);
      const res = await axios.get(url, { httpsAgent: agent });
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
