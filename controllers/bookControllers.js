import db from '../models/index.js';

const Book = db.books;

const bookControllers = {
    getAll: (req, res) => {},
    getById: (req, res) => {},
    addBookForm: (req, res) => {},
    addBook: (req, res) => {},
    update: (req, res) => {},
    remove: (req, res) => {},
    getBooksByUser: (req, res) => {}
};

export default bookControllers;
