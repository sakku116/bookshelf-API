const { nanoid } = require('nanoid')
const books = require('./books');

/*
dan object buku yang diolah server harus mempunyai struktur:
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

function getAllBooks(request, h) {
    return h.response({
        "status": "success",
        "data": {
            "books": books,
        }
    }).code(200);
};

function addBook(request, h) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(10);
    const finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    books.push({ 
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt 
    });

    // cek apakah berhasil dipush ke array books
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        if (name === undefined) {
            return h.response({
                "status": "fail",
                "message": "gagal menambahkan buku, mohon untuk mengisi nama buku"
            }).code(400);
        }
        else if (readPage > pageCount) {
            return h.response({
                "status": "fail",
                "message": "gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount"
            }).code(400);
        }
        else {
            return h.response({
                "status": "success",
                "message": "buku berhasil ditambahkan",
                "data": {
                    "bookId": id
                }
            }).code(200);
        }
    }
    else {
        return h.response({
            "status": "error",
            "message": "buku gagal ditambahkan"
        }).code(500);
    };
};

function getBookById(request, h) {
    const { bookId } = request.params;

    // buku yang didapat secara otomatis
    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return h.response({
            "status": "success",
            "data": {
                "book": book
            }
        }).code(200);
    }
    else {
        return h.response({
            "status": "fail",
            "message": "buku tidak dapat ditemukan"
        })
    };
};

function editBookById(request, h) {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
        if (name === undefined) {
            return h.response({
                "status": "fail",
                "message": "gagal memperbarui buku, mohon isi nama buku"
            }).code(400);
        }
        else if (readPage > pageCount) {
            return h.response({
                "status": "fail",
                "message": "gagal memperbarui buku, readPage tidak bleh lebih besar dari pageCount"
            })
        }
        else {
            // ubah value
                books[bookIndex] = {
                ...books[bookIndex],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            };
            return h.response({
                "status": "success",
                "message": "buku berhasil diperbarui"
            }).code(200);
        };
    }
    else {
        return h.response({
            "status": "fail",
            "message": "gagal memperbarui buku, id buku tidak ditemukan"
        }).code(404);
    };
};

function deleteBookById(request, h) {
    const { bookId } = request.params;
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
        // menghapus books item berdasarkan id
        books.splice(bookIndex, 1);

        return h.response({
            "status": "success",
            "message": "buku berhasil dihapus"
        }).code(200);
    }   
    else {
        return h.response({
            "status": "fail",
            "message": "buku gagal dihapus, id tidak ditemukan"
        }).code(400);
    }
};

module.exports = {
    getAllBooks,
    addBook,
    getBookById,
    editBookById,
    deleteBookById
}