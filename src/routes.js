const {
    getAllBooks,
    addBook,
    getBookById,
    editBookById,
    deleteBookById
} = require('./handler')

/*
REQUEST DOCS

- untuk menampilkan seluruh buku
    lakukan GET pada '/books'
    
- untuk menambah buku
    lakukan POST pada '/books'
    dengan menambahkan body request berformat (format buku default):
    {
        "name": "Buku A",
        "year": 2010,
        "author": "John Doe",
        "summary": "Lorem ipsum dolor sit amet",
        "publisher": "Dicoding Indonesia",
        "pageCount": 100,
        "readPage": 25,
        "reading": false
    }

- untuk mendapatkan buku tertentu
    lakukan GET pada '/books/{bookId}'.
    masukkan id buku.

- untuk mengedit buku
    lakukan PUT pada '/books/{bookId}'
    dan tambahkan body request default (diatas) untuk mengganti
    value pada objek objek target.

- untuk menghapus buku
    lakukan DELETE pada 'books/{bookId}'

*/

const routes = [
    {
        // menampilkan semua buku
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        // menambah buku
        method: 'POST',
        path: "/books",
        handler: addBook,
    },
    {
        // menampilkan buku tertentu
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookById,
    },
    {
        // mengubah buku
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookById,
    },
    {
        // menghapus buku
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById,
    }

];

module.exports = routes;