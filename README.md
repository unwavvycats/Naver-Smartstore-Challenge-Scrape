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

