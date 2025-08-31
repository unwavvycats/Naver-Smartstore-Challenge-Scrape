const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const proxy = "http://td-customer-mrscraperTrial-country-kr:P3nNRQ8C2@6n8xhsmh.as.thordata.net:9999";

(async () => {
  try {
    const agent = new HttpsProxyAgent(proxy); 
    const res = await axios.get("https://httpbin.org/ip", { httpsAgent: agent });
    console.log("✅ Proxy works, your IP is:", res.data);
  } catch (err) {
    console.error("❌ Proxy test failed:", err.message);
  }
})();
