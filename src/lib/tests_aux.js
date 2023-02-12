const fs = require('fs');
const http = require("http");
const { domFromHTML } = require("./scrap")
const config = require("../config.json")

const bookListHTML = fs.readFileSync('__tests__/booksListHTML.html',
            {encoding:'utf8', flag:'r'});
const document = domFromHTML(bookListHTML)
const firstBookDiv = document.querySelector("td.bibliocol")

function HTTPServerFactory(HTMLDocument){

    const server =  http.createServer(function (req, res) {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(HTMLDocument);
    });

    const connections = new Set()

    server.on('connection', function (connection) {
        connections.add(connection)      
        connection.on('close', function () {
          connections.delete(connection)
        });
    });

    return {
        _server: server,
        _connections: connections,
        listen: function (port) {
            this._server.listen(port)
        },
        close: function () {
            this._server.close()
            this._connections.forEach(connection=>{
                connection.destroy()
            })
        }
    }

}

module.exports = {
    bookListHTML,
    document,
    firstBookDiv,
    HTTPServerFactory
}