import { JSDOM } from "jsdom";

function normalizeURL(url) {
  // Function to normalize any url by using the url object.
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

function getURLsFromHTML(html, baseURL) {
  // Function to get all the urls from a page.
  const urls = [];
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");

  for (const anchor of anchors) {
    if (anchor.hasAttribute("href")) {
      let href = anchor.getAttribute("href");

      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href;
        urls.push(href);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }

  return urls;
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // Ensure that currentURL is in the same domain as baseURL
  const baseURLobj = new URL(baseURL);
  const currentURLobj = new URL(currentURL);

  if (currentURLobj.hostname !== baseURLobj.hostname) {
    return pages;
  }

  // Normalize the URL
  const currentURLNorm = normalizeURL(currentURL);

  // Check if normalized url is in the pages
  if (pages[currentURLNorm] > 0) {
    pages[currentURLNorm]++;
    return pages;
  }

  // Initialise page in array
  pages[currentURLNorm] = 1;

  // Parse the html
  let html = "";
  try {
    html = await parseHTLML(currentURL);
  } catch (err) {
    console.log("${err.message}");
    return pages;
  }

  // Get the links within the page and use recursion with the current function.
  const nextURLs = getURLsFromHTML(html, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }

  return pages;
}

async function parseHTLML(inputURL) {
  let response;
  try {
    response = await fetch(inputURL);
  } catch (err) {
    console.log(`an eror was thrown: ${err}`);
  }

  if (response.status > 399) {
    console.log(`Got HTTP error: ${response.status} ${response.statusText}`);
    return;
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    console.log("Got non-HTML response: ${contentType}");
    return;
  }

  return response.text();
}
export { normalizeURL, getURLsFromHTML, crawlPage };
