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
