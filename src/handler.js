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
    /*
    return h.response({
        status: "success",
        data: {
            books: books.map((book)=>(
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }
            ))
        }
    }).code(200);
    */
    const { name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt } = request.query;
    
    var query_keys = Object.keys(request.query);
    var query_total = Object.keys(request.query).length;

    function convertToBoolean(value) {
        if (value == 1) {
            return true;
        }
        else {
            return false;
        }
    };

    function filterByNameIndex(value) {
        var filtered_item = [];
        for (let item_idx in books) {
            if (String(books[item_idx].name).toLowerCase() === value.toLowerCase()) {
                filtered_item.push(item_idx)
            };
        };
        return filtered_item;
    };

    function filterByFinishedIndex(value) {
        var filtered_item = [];
        for (let item_idx in books) {
            if (books[item_idx].finished === value) {
                filtered_item.push(item_idx)
            };
        };
        return filtered_item;
    };

    function filterByReadingIndex(value) {
        var filtered_item = [];
        for (let item_idx in books) {
            if (books[item_idx].reading === value) {
                filtered_item.push(item_idx);
            };
        };
        return filtered_item;
    };

    var filter_by_queries_index = [];

    function filterByAllQueriesIndex() {
        var array_of_arrays = []

        for (let idx in query_keys) {
            if (query_keys[idx] === 'name') {
                array_of_arrays.push(filterByNameIndex(name));
            }
            else if (query_keys[idx] === 'finished') {
                array_of_arrays.push(filterByFinishedIndex(convertToBoolean(finished)));
            }
            else if (query_keys[idx] === 'reading') {
                array_of_arrays.push(filterByReadingIndex(convertToBoolean(reading)));
            }
        };

        // menggabungkan semua array menjdai satu array
        var combined_array = [];
        for (let i in array_of_arrays) {
            var array = array_of_arrays[i]
            for (let j in array){
                combined_array.push(array[j])
            };
        };

        // evaluasi filter untuk mendapatkan data yang telah terfilter dengan beberapa query
        var filtered_array = []
        var counts = {};
        // hitung jumlah setiap item array dalam bentuk object
        combined_array.forEach(function(i) { counts[i] = (counts[i]||0) + 1;});
        // jika jumlah nya 2 berarti dia terfilter oleh beberapa query
        for (i in Object.keys(counts)) {
            if (Object.values(counts)[i] > (query_total-1)) {
                filtered_array.push(Object.keys(counts)[i])
            }
        }

        return filtered_array;
    };

    function getFilteredBooks(arr) {
        var filtered_books = [];

        for (let i of arr) {
            filtered_books.push(books[i])
        };
        return filtered_books.map((book)=>(
            {
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }
        ));
    };

    if (query_total == 0) {
        // jika client tidak memasukkan query
        books
        return h.response({
            status: "success",
            data: {
                "books": books.map((book)=>(
                    {
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    }
                ))
            }
        }).code(200);
    }
    else if (query_total > 0) {
        // jika client memasukkan query
        return h.response({
            "status": "success",
            "data": {
                "books": getFilteredBooks(filterByAllQueriesIndex())
            }
        }).code(200);
    };
    
};

function addBook(request, h) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(10);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
    if (name === undefined) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400);
    }
    else if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    }

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
        return h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id
            }
        }).code(201);
    }
    
    else {
        return h.response({
            status: "error",
            message: "Buku gagal ditambahkan"
        }).code(500);
    };
};

function getBookById(request, h) {
    const { bookId } = request.params;

    // buku yang didapat secara otomatis
    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return h.response({
            status: "success",
            data: {
                book: book
            }
        }).code(200);
    }
    else {
        return h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        }).code(404);
    };
};

function editBookById(request, h) {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
        if (name === undefined) {
            return h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku"
            }).code(400);
        }
        else if (readPage > pageCount) {
            return h.response({
                status: "fail",
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            }).code(400);
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
                status: "success",
                message: "Buku berhasil diperbarui"
            }).code(200);
        };
    }
    else {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
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
            status: "success",
            message: "Buku berhasil dihapus"
        }).code(200);
    }   
    else {
        return h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404);
    }
};

module.exports = {
    getAllBooks,
    addBook,
    getBookById,
    editBookById,
    deleteBookById
}