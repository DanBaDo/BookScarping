const { Book, Author } = require("../src/types")

describe("Book",()=>{
    const book = new Book("the title", "the author", "the image", "the url")
    test("Chech title",()=>{
        expect(book).toHaveProperty("title","the title")
    })
    test("Chech author",()=>{
        expect(book).toHaveProperty("author","the author")
    })
    test("Chech image",()=>{
        expect(book).toHaveProperty("image","the image")
    })
    test("Chech URL",()=>{
        expect(book).toHaveProperty("URL","the url")
    })
})

describe("Author",()=>{
    const author = new Author("the name", "the surname", "the url")
    test("Check name",()=>{
        expect(author).toHaveProperty("name","the name")
    })
    test("Check surname",()=>{
        expect(author).toHaveProperty("surname","the surname")
    })
    test("Check URL",()=>{
        expect(author).toHaveProperty("URL","the url")
    })
})