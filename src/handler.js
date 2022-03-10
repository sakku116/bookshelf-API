const { nanoid } = require('nanoid')
const books = require('./books');

function getAllBooks(request, h) {
    const { name, year, author, summary, 
        publisher, pageCount, readPage, finished, 
        reading, insertedAt, updatedAt } = request.query;
    
    var query_keys = Object.keys(request.query);
    var query_total = Object.keys(request.query).length;

    function toBoolean(value) {
        if (value == 1) {
            return true;
        }
        else {
            return false;
        }
    };

    function getBookIndexBy_name(value) {
        var filtered_item = [];
        for (let item_idx in books) {
            if (String(books[item_idx].name).toLowerCase() === value.toLowerCase()) {
                filtered_item.push(item_idx)
            };
        };
        return filtered_item;
    };

    function getBookIndexBy_finished(value) {
        var filtered_item = [];
        for (let item_idx in books) {
            if (books[item_idx].finished === value) {
                filtered_item.push(item_idx)
            };
        };
        return filtered_item;
    };

    function getBookIndexBy_reading(value) {
        var filtered_item = [];
        for (let item_idx in books) {
            if (books[item_idx].reading === value) {
                filtered_item.push(item_idx);
            };
        };
        return filtered_item;
    };

    var filter_by_queries_index = [];

    function getBookIndexBy_allQueries() {
        var arrays = []

        if (name !== undefined) {
            arrays.push(getBookIndexBy_name(name));
        }
        else if (finished !== undefined) {
            arrays.push(getBookIndexBy_finished(toBoolean(finished)));

        }
        else if (reading !== undefined) {
            arrays.push(getBookIndexBy_reading(toBoolean(reading)));
        };

        // menggabungkan semua array menjdai satu array
        var combined_arrays = [];
        for (let i in arrays) {
            var array = arrays[i]
            for (let j in array){
                combined_arrays.push(array[j])
            };
        };

        // hapus index yang tidak memenuhi queries filter
        var filtered_items = [];
        // hitung jumlah setiap item array dalam bentuk object
        var count_items = {};
        combined_arrays.forEach(function(i) { count_items[i] = (count_items[i]||0) + 1;});
        // jika jumlah nya sama denagn jumlah query, berarti dia terfilter oleh beberapa query
        for (i in Object.keys(count_items)) {
            if (Object.values(count_items)[i] == query_total) {
                filtered_items.push(Object.keys(count_items)[i])
            };
        };

        return filtered_items;
    };

    function getFilteredBooks(arr) {
        var filtered_books = [];

        for (let i of arr) {
            filtered_books.push(books[i])
        };
        
        return filtered_books;
    };

    if (query_total == 0) {
        var books_result = books;
        var status = "success";
    }
    else {
        var books_result = getFilteredBooks(getBookIndexBy_allQueries());
        var book_items = books_result.length
        if (book_items === 0) {
            var status = "success with 0 result";
        }
        else {
            var status = "success";
        };
    };
    
    return h.response({
        status: status,
        data: {
            "books": books_result.map((book)=>(
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }
            ))
        }
    }).code(200);
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
};