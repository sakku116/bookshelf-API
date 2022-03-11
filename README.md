# bookshelf-API
Backend app for Dicoding submission.
>Postman test of Dicoding may not qualify (in some aspects) because this project has been further developed.

This API application just for practice. It doesn't store data from client request. So, if the server is restarted, the data also will be restarted.

**main functionalities**:
- `GET` 'localhost:5000/books'

  get all books.
  
- `POST` 'localhost:5000/books'

  add/create new book.
  
- `GET` 'localhost:5000/books/{bookId}'

  get spesific book by the id.
  
- `PUT` 'localhost:5000/books/{bookId}'

  change/edit book property.
  
- `DELETE` 'localhost:5000/books/{bookId}'

  delete spesific book by the id.
  
Also, there is another little functionality you can do in 'localhost:5000/books' for `GET` method (get all books). You can pass query parameters in it.
Supported query parameters including `name={string}`, `redading={0 or 1}`, `finished={0 or 1}` that allows client to get all book items filtered with that query parameters.
