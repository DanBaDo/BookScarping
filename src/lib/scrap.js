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
  let lastPageNumber = parseInt(
    new URLSearchParams(document.querySelector("a[rel='last']").href).get("page")
  )

  while ( lastPageNumber > 0 ) {
    const paginationQueryParameters = new URLSearchParams(config.paginationQueryParams)
    paginationQueryParameters.set("page", lastPageNumber)
    const baseURL = new URL(baseURLString)
    baseURL.search += "&"+paginationQueryParameters.toString()
    pagesURL.unshift(
      baseURL.toString()
    )
    lastPageNumber--
  }

  return pagesURL

}

function imageFromBookDiv(bookDiv) {
  return bookDiv.querySelector("div.coverimages img").src
}

function titleFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.title").innerHTML.trim()
}

function bookURLFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.title").href
}

function authorNameFromBookDiv(bookDiv) {
  const nameStrings = bookDiv.querySelector("a.author").innerHTML.split(", ")
  return {
    name: nameStrings[1].trim(),
    surname: nameStrings[0].trim()
  }
}

function authorURLFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.author").href
}

module.exports = {
  htmlFromURL,
  domFromHTML,
  pagesURLsFromListDocument,
  booksDivsFromListDocument,
  imageFromBookDiv,
  titleFromBookDiv,
  bookURLFromBookDiv,
  authorNameFromBookDiv,
  authorURLFromBookDiv
}