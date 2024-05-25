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

async function crawlPage(currentURL) {
  let response;
  try {
    response = await fetch(currentURL);
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

  console.log(await response.text());
}

export { normalizeURL, getURLsFromHTML, crawlPage };
