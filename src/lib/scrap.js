const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

const config = require("../config.json")

async function htmlFromURL(url) {

  // Prepara browser
  const browser = await puppeteer.launch() ;
  const page = await browser.newPage();
  // Get document
  const response = await page.goto(url);
  const HTML = await response.text();
  // Cleanup
  browser.close();

  return HTML;

}

function domFromHTML(html) {
    const { window: { document } } = new jsdom.JSDOM(html)
    return document
}

function booksDivsFromListDocument(document) {
  return document.querySelectorAll("td.bibliocol")
}

function pagesURLsFromListDocument(document, baseURLString) {
  const pagesURL = []
  
  const lastPageNumber = new URL(document.querySelector("a[rel='last']").href)
    .searchParams
    .get("page")

  while ( lastPageNumber > 0 ) {
    const paginationQueryParameters = new URLSearchParams(config.paginationQueryParams).set("page", lastPageNumber)
    const baseURL = new URL(baseURLString)
    baseURL.search += paginationQueryParameters
    pagesURL.unshift(
      baseURL.toString
    )
    lastPageNumber--
  }

}

function imageFromBookDiv(bookDiv) {
  return bookDiv.querySelector("div.coverimages img")
}

function titleFromBookDiv(bookDiv) {
  bookDiv.querySelector("a.title").innerText
}

function bookURLFromBookDiv(bookDiv) {
  bookDiv.querySelector("a.title").href
}

function authorNameFromBookDiv(bookDiv) {
  const nameStrings = bookDiv.querySelector("a.author").innerText.split(" ")
  return {
    name: nameStrings[1],
    surname: nameStrings[0]
  }
}

function authorURLFromBookDiv(bookDiv) {
  bookDiv.querySelector("a.author").href
}

module.exports = {
  htmlFromURL,
  domFromHTML,
  booksDivsFromDocument: booksDivsFromListDocument,
  imageFromBookDiv,
  titleFromBookDiv,
  bookURLFromBookDiv,
  authorNameFromBookDiv,
  authorURLFromBookDiv
}