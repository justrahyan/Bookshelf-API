import { nanoid } from "nanoid";

let books = [];

const addBookHandler = (request, h) => {
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const id = nanoid(16);

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const newBook = {
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
    updatedAt,
  };

  books.push(newBook);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBookHandler = (request, h) => {
  let allBook = [];
  const {
    name: queryName,
    reading: readingStr,
    finished: finishedStr,
  } = request.query;
  const finished = Number.parseInt(finishedStr, 10);
  const reading = Number.parseInt(readingStr, 10);

  if (queryName) {
    const nameLowerCase = queryName.toLowerCase();
    allBook = books.reduce((acc, book) => {
      const bookName = book.name.toLowerCase();
      if (bookName.includes(nameLowerCase)) {
        const { id, name, publisher } = book;
        acc.push({ id, name, publisher });
      }
      return acc;
    }, []);
  } else if (reading === 0) {
    // Menampilkan buku yang belum dibaca
    allBook = books
      .filter((book) => book.reading === false)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else if (reading === 1) {
    // Menampilkan buku yang sedang dibaca
    allBook = books
      .filter((book) => book.reading === true)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else if (finished === 0) {
    // Menampilkan buku yang belum selesai dibaca
    allBook = books
      .filter((book) => book.finished === false)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else if (finished === 1) {
    // Menampilkan buku yang sudah selesai dibaca
    allBook = books
      .filter((book) => book.finished === true)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else {
    allBook = books.map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });
  }

  const response = h.response({
    status: "success",
    data: {
      books: allBook,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookById = books.find((book) => book.id === bookId);

  if (!bookById) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book: bookById,
    },
  });
  response.code(200);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const { bookId } = request.params;
  const id = bookId;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const newBookData = {
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
    updatedAt,
  };

  let isBookExist = false;

  books = books.map((book) => {
    if (book.id === bookId) {
      isBookExist = true;

      return { ...book, ...newBookData, insertedAt: book.insertedAt };
    }
    return book;
  });

  if (!isBookExist) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const booksLength = books.length;

  books = books.filter((book) => book.id !== bookId);

  if (booksLength === books.length) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

export {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
