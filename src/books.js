/*
object buku yang diolah server harus mempunyai struktur:
{
    "id": "Qbax5Oy7L8WKf74l", // <-
    "name": "Buku A",
    "year": 2010,
    "author": "John Doe",
    "summary": "Lorem ipsum dolor sit amet",
    "publisher": "Dicoding Indonesia",
    "pageCount": 100,
    "readPage": 25,
    "finished": false, // <-
    "reading": false,
    "insertedAt": "2021-03-04T09:11:44.598Z", // <-
    "updatedAt": "2021-03-04T09:11:44.598Z" // <-
}
(tanda '<-' merupakan objek tambahan yang harus ada di server, selain itu adalah objek default item (book))
*/

const books = [];

module.exports = books;