const fs = require('fs');
const config = require("../src/config.json")

const {
    htmlFromURL,
    domFromHTML,
    pagesURLsFromListDocument,
    booksDivsFromListDocument,
    titleFromBookDiv,
    imageFromBookDiv,
    authorNameFromBookDiv,
    authorSurnameFromBookDiv,
    authorURLFromBookDiv,
    bookURLFromBookDiv,
    authorFromBookDiv,
    bookFromBookDiv,
    booksFromListURL
} = require("../src/lib/scrap");

const { bookListHTML, document, firstBookDiv, HTTPServerFactory } = require("../src/lib/tests_aux");
const { Author, Book } = require('../src/types');

/*
test("Get HTML from URL", async ()=>{
    const HTMLDocument = "It works!"
    const HTTPServer = HTTPServerFactory(HTMLDocument)
    HTTPServer.listen(8000)
    const HTML = await htmlFromURL("http://localhost:8000")
    expect(HTML).toBe(HTMLDocument)
    HTTPServer.close()
})
*/

test("Get dom from HTML", ()=>{
    expect(domFromHTML(bookListHTML).constructor.name).toBe("Document")
})

describe("pagesURLsFromListDocument", ()=>{
    const URLs = pagesURLsFromListDocument(document, config.bookLists[0].URL)
    test("Expect 66 URLs", ()=>{
        expect(URLs.length).toEqual(66)
    })
    test("Check first URL syntax", ()=>{
        expect(URLs[0]).toEqual(config.bookLists[0].URL+"&page=1&sortfield=title&direction=asc")
    })
})

describe("booksDivsFromListDocument",()=>{
    const divs = booksDivsFromListDocument(document)
    test("Got 20 book divs",()=>{
        expect(divs.length).toEqual(20)
    })
})

describe("titleFromBookDiv",()=>{
    const title = titleFromBookDiv(firstBookDiv)
    test("Check first div title",()=>{
        expect(title).toBe("¡Apártate de Mississippi!    / Cornelia Funke ; ilustraciones de la autora ; traducción de Rosa Pilar Blanco.")
    })
})

describe("imageFromBookDiv",()=>{
    const image = imageFromBookDiv(firstBookDiv)
    test("Check first div image URL",()=>{
        expect(image).toBe("//dixirep.qlees.es/application/GetImage.php?img=Zo9z1NHazNDXdtim3p3TrdjF4Mrek3mlaZlnkXma0d7J1Nm01HCfcJl4opytmaSagK5l0qjI")
    })
})

describe("authorNameFromBookDiv",()=>{
    const name = authorNameFromBookDiv(firstBookDiv)
    test("Check first div author name",()=>{
        expect(name).toBe("Cornelia")
    })
})

describe("authorSurnameFromBookDiv",()=>{
    const surname = authorSurnameFromBookDiv(firstBookDiv)
    test("Check first div author surnmae",()=>{
        expect(surname).toBe("Funke")
    })
})

describe("authorURLFromBookDiv",()=>{
    const URL = authorURLFromBookDiv(firstBookDiv)
    test("Check first div book URL",()=>{
        expect(URL).toBe("/cgi-bin/koha/opac-search.pl?q=au:Funke,%20Cornelia%20")
    })
})

describe("authorFromBookDiv",()=>{
    test("Instance author from book div",()=>{
        const author = authorFromBookDiv(firstBookDiv)
        expect(author).toBeInstanceOf(Author)
    })
})

describe("bookFromBookDiv",()=>{
    test("Instance book from book div",()=>{
        const book = bookFromBookDiv(firstBookDiv)
        expect(book).toBeInstanceOf(Book)
    })
})

describe("booksFromListURL", ()=>{
    let HTTPServer
    beforeEach(() => {
        HTTPServer = HTTPServerFactory(bookListHTML)
        HTTPServer.listen(8000)
    });
    afterEach(() => {
        HTTPServer.close()
    });
    test("Check if there are 20 books", async ()=>{
        const books = await booksFromListURL("http://localhost:8000")
        expect(books.length).toEqual(20)
    })
    test("Check that at least first element is a book", async ()=>{
        const books = await booksFromListURL("http://localhost:8000")
        expect(books[0]).toBeInstanceOf(Book)
    })
})

