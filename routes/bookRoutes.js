import express from 'express';

import bookControllers from '../controllers/bookControllers.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const {
    getAll,
    getById,
    addBookForm,
    addBook,
    update,
    remove,
    getBooksByUser
} = bookControllers;

// routes
router.get('/books', getAll);
router.get('/books/:id', getById);
router.get('/add-book', verifyToken, addBookForm);
router.post('/add-book', verifyToken, addBook);
router.put('/books/:id', verifyToken, update);
router.delete('/books/:id', verifyToken, remove);
router.get('/books-by-user/:id', verifyToken, getBooksByUser);

export default router;
