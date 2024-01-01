import { Book } from "./Abstract.mjs";
import { Students } from "./Students.mjs";
import { Lists } from "./Lists.mjs";

export const Books = Object.freeze({
    /**
     * Adiciona um livro ao localStorage.
     * 
     * @param {number} id - Id do livro.
     * @param {string} name - Nome do livro.
     * @param {string} author - Autor do livro.
     * @param {number} pages - Quantidade de páginas do livro.
     * @param {number} year - Ano do livro.
     * @returns {void}
     */
    addBook: (id, name, author, pages, year) => {
        console.log(`localStorage: salvando livro "${name}"...`);
        const book = new Book(id, name, author, pages, year);
        book.type = "Book";
        localStorage.setItem(id, JSON.stringify(book));
        console.log(`localStorage: livro "${name}" salvo com sucesso!`);
    },

    /**
     * Busca todos os livros.
     * 
     * @returns {Array} - Array com todos os livros.
     */
    getAllBooks: () => {
        const books = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const book = localStorage.getItem(key);
            const bookObject = JSON.parse(book);
            if (bookObject.type == "Book") {
                books.push(book);
            }
        }
        return books;
    },

    /**
     * Busca um livro pelo o seu id.
     * 
     * @param {number} id - Id do livro.
     * @returns {Object} - Objeto do livro.
     * @returns {boolean} - Retorna false se o livro não foi encontrado.
     */
    getBookById: (id) => {
        console.log(`localStorage: procurando livro com id "${id}"...`);
        const book = localStorage.getItem(id);
        const bookOject = JSON.parse(book);

        if (book && bookOject.type == "Book") {
            return bookOject;
        } else {
            console.error(`localStorage: livro com id "${id}" não encontrado...`);
            return false;
        }
    },

    /**
     * Remove um livro pelo o seu id.
     * 
     * @param {number} id - Id do livro.
     * @returns {boolean} - Retorna true se o livro foi removido com sucesso.
     */
    removeBookById: (id) => {
        console.log(`localStorage: removendo livro com id "${id}"...`);
        const book = Books.getBookById(id);

        if (book) {
            if (book.lentTo != null) {
                const student = Students.getStudentById(book.lentTo);
                student.lentBook = null;
                localStorage.setItem(student.id, JSON.stringify(student));
            }

            localStorage.removeItem(id);
            Lists.showBookList();
            console.log(`localStorage: livro removido com sucesso!`);
            return true;
        } else {
            alert(`O livro com id "${id}" não foi encontrado.`);
            console.error(`localStorage: livro com id "${id}" não encontrado...`);
            return false;
        }
    },

    /**
     * Empresta um livro para um estudante.
     * 
     * @param {number} bookId - Id do livro.
     * @param {number} studentId - Id do estudante.
     * @param {string} lentDate - Data de entrega.
     * @returns {void}
     */
    lendBook: (bookId, studentId, lentDate) => {
        console.log(`localStorage: emprestando livro "${bookId}" para o estudante "${studentId}"...`);
        const book = Books.getBookById(bookId);
        const student = Students.getStudentById(studentId);
        book.lent = true;
        book.lentTo = studentId;
        book.lentDate = lentDate.replace("-", "/").replace("-", "/");
        student.lentBook = bookId;
        localStorage.setItem(bookId, JSON.stringify(book));
        localStorage.setItem(studentId, JSON.stringify(student));
        console.log(`localStorage: livro "${bookId}" emprestado para o estudante "${studentId}" com sucesso!`);
    }
});