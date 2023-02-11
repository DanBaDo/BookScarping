class Author {
    constructor(name, surname, URL) {
        this.name = name
        this.surname = surname
        this.URL = URL
    }
}

class Book {
    constructor(title, author, image, URL){
        this.title = title
        this.author = author
        this.image = image
        this.URL = URL
    }
}

module.exports = {
    Author,
    Book
}