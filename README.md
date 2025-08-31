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

## Step 5 – User-Agent Rotation  

Websites like Naver can block bots by checking if all requests come with the same **User-Agent** (the browser signature string).  
To avoid looking like a bot, I added a pool of User-Agents (Chrome, Firefox, Safari, Edge).  

On each request, the scraper randomly picks one:  

```js
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Chrome...",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X)...Safari...",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64)...Firefox...",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Edge...",
];

const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

```
Combined Strategies

At this point my scraper has:
Retry logic (up to 5 tries).
- Randomized backoff (3–10s wait between tries).
- User-Agent rotation (pretend to be different browsers).
- Proxy support (using the challenge proxy, even if it fails).

Current Status

- On Naver’s Smartstore product page, the scraper still hits 429 Too Many Requests or SSL issues with the provided proxy.
- However, the retry, random delays, and UA rotation are working correctly — I can see each attempt cycle with a different User-Agent.

if this were on production, i would:
 - Rotate multiple proxies instead of just one, even though i tried using free proxies scraper still wont allow it i think there is some better tools (paid) like scrape.do or else that may support the proxies rotation
 - Add session cookies or even simulates browser behavior with puppeteer or playwright based on what i read could be effective on some cases.

 ## Step 6 – API Wrapper  

Now I exposed my scraper as a small **Express.js API**.  
This way, instead of running the script manually, anyone can hit an endpoint like:

http://localhost:3000/scrape?url=https://smartstore.naver.com/rainbows9030/products/11102379008

and the server will:  
1. Rotate **User-Agent** headers.  
2. Use **retry logic + random backoff**.  
3. Try with the provided **proxy** (though it still fails, documented).  
4. Return JSON with the scraped HTML length + a snippet for inspection.

---

### Example Output  

```json
{
  "success": true,
  "length": 231045,
  "snippet": "<!doctype html><html lang=\"ko\"><head><meta charset=\"utf-8\">..."
}
```

how to run 
npm install
node apiServer.js
then open your browser and access the link provided above 

 ## Step 7 - Build a API with Ngrok

Finally, I built apiServer.js – an Express server that exposes an API for scraping.

Features:

Endpoint /scrape?url=...
- Uses proxy, retry logic, and user-agent rotation under the hood.
- Returns JSON with the scraped page snippet and length.
- Hosted via Ngrok so it can be accessed from the internet.

Example usage (after running node apiServer.js and starting ngrok): 
curl "https://dd31b356a286.ngrok-free.app/scrape?url=https://quotes.toscrape.com"

with the Response like 
```json
{
  "success": true,
  "length": 10584,
  "snippet": "<!DOCTYPE html><html lang=\"en\">..."
}
```
This completes the deliverables:
- Hosted API (Ngrok)
- Source code (GitHub repo)
- README with setup + explanation