const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

const config = require("../config.json");
const { Book, Author } = require('../types');

async function htmlFromURL(url) {
  // Prepara browser
  const browser = await puppeteer.launch();
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
    new URLSearchParams(
      document.querySelector("a[rel='last']")
      .href
    ).get("page")
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
  return bookDiv.querySelector("div.coverimages img")?.src
}

function titleFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.title")?.innerHTML
    .trim()
}

function bookURLFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.title")?.href
}

function authorNameFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.author")?.innerHTML
    .split(", ")[1]
    .trim()
}

function authorSurnameFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.author")?.innerHTML
    .split(", ")[0]
    .trim()
}

function authorURLFromBookDiv(bookDiv) {
  return bookDiv.querySelector("a.author")?.href
}

function authorFromBookDiv(bookDiv){
  return new Author(
    authorNameFromBookDiv(bookDiv),
    authorSurnameFromBookDiv(bookDiv),
    authorURLFromBookDiv(bookDiv)
  )
}

function bookFromBookDiv(bookDiv){
  return new Book(
    titleFromBookDiv(bookDiv),
    authorFromBookDiv(bookDiv),
    imageFromBookDiv(bookDiv),
    bookURLFromBookDiv(bookDiv)
  )
}

async function booksFromListURL(listURL) {
  const books = [];
  const HTML = await htmlFromURL(listURL)
  const document = domFromHTML(HTML)
  const bookDivs = booksDivsFromListDocument(document)
  bookDivs.forEach(div => books.push(bookFromBookDiv(div)))
  return books
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
  authorSurnameFromBookDiv,
  authorURLFromBookDiv,
  authorFromBookDiv,
  bookFromBookDiv,
  booksFromListURL
}