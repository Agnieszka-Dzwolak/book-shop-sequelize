import db from '../models/index.js';

const Book = db.books;

const bookControllers = {
    getAll: async (req, res) => {
        try {
            const books = await Book.findAll();
            const token = req.cookies.token;
            res.status(200).render('books', { books, token });
        } catch (err) {
            res.status(500).render('404', {
                title: 'Some error occurred while retrieving books',
                message: 'Some error occurred while retrieving books'
            });
        }
    },
    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const book = await Book.findOne({ where: { id: id } });
            if (book) {
                res.status(200).render('book', { book });
            } else {
                res.status(400).render('404', {
                    title: `Book with id: ${id} not found`,
                    message: `Book with id: ${id} not found`
                });
            }
        } catch (err) {
            res.status(500).render('404', {
                title: `Some error occurred while retrieving book with id: ${id}`,
                message: `Some error occurred while retrieving book with id: ${id}`
            });
        }
    },
    addBookForm: (req, res) => {
        res.status(200).render('add-book-form');
    },
    addBook: async (req, res) => {
        const { title, author, price, img, user_id } = req.body;
        const userId = req.cookies.userId;
        try {
            if (title && author && price && img && userId) {
                const newBook = await Book.create({
                    title: title,
                    author: author,
                    price: price,
                    img: img,
                    user_id: userId
                });
                res.status(200).render('book', { book: newBook });
            } else {
                res.status(400).render('404', {
                    title: 'All fields are required to add a new book',
                    message: 'All fields are required to add a new book'
                });
            }
        } catch (err) {
            res.status(500).render('404', {
                title: `Some error occurred while adding a book`,
                message: `Some error occurred while adding a book`
            });
        }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { title, author, price, img } = req.body;

        try {
            if (title && author && price && img) {
                const updatedBook = await Book.update(
                    { title, author, price, img },
                    { where: { id } }
                );
                res.status(200).render('book', { book: updatedBook });
            } else {
                res.status(400).render('404', {
                    title: 'All fields are required to update a book',
                    message: 'All fields are required to update a book'
                });
            }
        } catch (err) {
            res.status(500).render('404', {
                title: `Some error occurred while updating book with id: ${id}`,
                message: `Some error occurred while updating book with id: ${id}`
            });
        }
    },
    remove: async (req, res) => {
        const { id } = req.params;
        try {
            const bookDeleted = await Book.destroy({ where: { id } });
            res.status(302).redirect('/api/books');
        } catch (err) {
            res.status(500).render('404', {
                title: `Some error occurred while deleting book with id: ${id}`,
                message: `Some error occurred while deleting book with id: ${id}`
            });
        }
    },
    getBooksByUser: async (req, res) => {
        const { id } = req.params;
        try {
            const books = await Book.findAll({ where: { user_id: id } });
            res.status(200).render('books', { books: books });
        } catch (err) {
            res.status(500).render('404', {
                title: `Failed to retrieve user's books`,
                message: `Failed to retrieve user's books`
            });
        }

        // const { user_id } = req.params;
        // try {
        //     const books = await Book.findAll({ where: { user_id } });

        //     if (books.length > 0) {
        //         res.status(200).render('books', { books: books });
        //     } else {
        //         res.status(404).render('404', {
        //             title: 'No books found for the specified user',
        //             message: 'No books found for the specified user'
        //         });
        //     }
        // } catch (err) {
        //     res.status(500).render('404', {
        //         title: `Failed to retrieve user's books`,
        //         message: `Failed to retrieve user's books`
        //     });
        // }
    }
};

export default bookControllers;
