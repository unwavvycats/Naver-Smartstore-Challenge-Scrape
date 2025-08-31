# Naver Smartstore Challenge Scraper

This repo is where I document my progress for the Naver Smartstore scraping challenge.  
I’m starting small and building up step by step.

---

## Step 1 – First Test

I set up a Node.js project with:

- `npm init -y` to get things started.
- Installed `express`, `axios`, and `cheerio`.

Then I wrote a simple server (`server.js`) with one endpoint `/scrape`.  
For now, I tested it on [quotes.toscrape.com](https://quotes.toscrape.com), which is a practice site for learning scraping.

When I run the server and visit `http://localhost:3000/scrape`, it fetches and shows me the first quote from the site.  
This means my setup works: server is running, axios fetches data, cheerio parses HTML, and I can serve scraped content.

---

## How to run

```bash
npm install
node server.js
```


## Step 2 – First Scraper
In this step I created `scraper.js` to test scraping a simple site (`quotes.toscrape.com`).  
I used **axios** to fetch the page and **cheerio** to read the HTML and extract all the quotes and authors.  

When I run:
- 'node scraper.js'
I can see the scraped quotes printed in the terminal. This proves the setup works and I can start building the Naver scraper later.

## Step 3 – Proxy Testing
The challenge gave me a proxy string to use: 6n8xhsmh.as.thordata.net:9999:td-customer-mrscraperTrial-country-kr:P3nNRQ8C2
I set up a small script (proxyTest.js) to check if the proxy works by sending my request through it to https://httpbin.org/ip.
This way I can see if the IP changes, which means the proxy is working.

When I run this test, I get SSL and connection errors (like wrong version number or 429 Too Many Requests).
That means the code is correct, but the proxy provided in the challenge doesn’t actually let me through.

To confirm, I also tested with some free proxies from the internet, and the script works as expected.
So the takeaway is: my setup is fine, but the given proxy is either blocked or expired.

For the next step i will try implementing a Retry logic and documenting the errors so even if the scrape doesn't succeed,
the project will show how it should work.

## Step 4 – Retry Logic + Random Delays  

At this point I noticed that Naver blocks requests quickly with **429 Too Many Requests**.  
To make my scraper more realistic and resilient, I added two strategies:  

1. **Retry logic** – if a request fails, it will automatically retry up to 5 times.  
2. **Randomized backoff** – between retries, the script waits for a random time between 3–10 seconds.  
   This way it doesn’t hammer the site at predictable intervals.  

Here’s a simplified version of the logic:  

```js
for (let i = 1; i <= retries; i++) {
  try {
    const res = await axios.get(url, { httpsAgent: agent });
    return res.data;
  } catch (err) {
    if (i < retries) {
      const delay = Math.random() * (10000 - 3000) + 3000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

When I test it on Naver’s product page, the proxy still gives me errors (429 or SSL issues).
But the retry system is working perfectly — I can see each attempt and the randomized wait time.

For the next step i will be trying out some new feature such as
- Fallback to direct connection when the proxy fails
- User Rotation so it pretends to be from a different browsers
