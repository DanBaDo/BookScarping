const fs = require('fs');
const config = require("../src/config.json")

const {
    domFromHTML,
    pagesURLsFromListDocument,
    booksDivsFromListDocument,
    titleFromBookDiv,
    imageFromBookDiv,
    authorNameFromBookDiv,
    bookURLFromBookDiv,
    authorURLFromBookDiv,
    bookFromBookDiv
} = require("../src/lib/scrap")

const bookListHTML = fs.readFileSync('__tests__/booksListHTML.html',
            {encoding:'utf8', flag:'r'});
const document = domFromHTML(bookListHTML)
const bookDiv = document.querySelector("td.bibliocol")

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
    const title = titleFromBookDiv(bookDiv)
    test("Check first book title is ¡Apártate de Mississippi!",()=>{
        expect(title).toBe("¡Apártate de Mississippi!    / Cornelia Funke ; ilustraciones de la autora ; traducción de Rosa Pilar Blanco.")
    })
})

describe("imageFromBookDiv",()=>{
    const image = imageFromBookDiv(bookDiv)
    test("Check first image URL",()=>{
        expect(image).toBe("//dixirep.qlees.es/application/GetImage.php?img=Zo9z1NHazNDXdtim3p3TrdjF4Mrek3mlaZlnkXma0d7J1Nm01HCfcJl4opytmaSagK5l0qjI")
    })
})

describe("authorNameFromBookDiv",()=>{
    const author = authorNameFromBookDiv(bookDiv)
    test("Check first author name",()=>{
        expect(author).toHaveProperty("name","Cornelia")
    })
    test("Check first author surnmae",()=>{
        expect(author).toHaveProperty("surname","Funke")
    })
})

describe("bookURLFromBookDiv",()=>{
    test("Check first book URL",()=>{
        const url = bookURLFromBookDiv(bookDiv)
        expect(url).toBe("/cgi-bin/koha/opac-detail.pl?biblionumber=750105")
    })
})

describe("authorURLFromBookDiv",()=>{
    test("Check first book author URL",()=>{
        const url = authorURLFromBookDiv(bookDiv)
        expect(url).toBe("/cgi-bin/koha/opac-search.pl?q=au:Funke,%20Cornelia%20")
    })
})

describe("bookFromBookDiv",()=>{
    const book = bookFromBookDiv(bookDiv)
    test("Chech first book title",()=>{
        expect(book).toHaveProperty("title","¡Apártate de Mississippi!    / Cornelia Funke ; ilustraciones de la autora ; traducción de Rosa Pilar Blanco.")
    })
    test("Chech first book author name",()=>{
        expect(book).toHaveProperty("author.name","Cornelia")
    })
    test("Chech first book author surname",()=>{
        expect(book).toHaveProperty("author.surname","Funke")
    })
    test("Chech first book author URL",()=>{
        expect(book).toHaveProperty("author.URL","/cgi-bin/koha/opac-search.pl?q=au:Funke,%20Cornelia%20")
    })
    test("Chech first book image",()=>{
        expect(book).toHaveProperty("image","//dixirep.qlees.es/application/GetImage.php?img=Zo9z1NHazNDXdtim3p3TrdjF4Mrek3mlaZlnkXma0d7J1Nm01HCfcJl4opytmaSagK5l0qjI")
    })
    test("Chech first book URL",()=>{
        expect(book).toHaveProperty("URL","/cgi-bin/koha/opac-detail.pl?biblionumber=750105")
    })
})