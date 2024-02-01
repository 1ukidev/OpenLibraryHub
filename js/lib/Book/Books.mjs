import { Book } from "../Abstract.mjs";
import { Students } from "../Student/Students.mjs";
import { Lists } from "../Lists.mjs";

const Books = Object.freeze({
    /**
     * Adiciona um livro ao localStorage.
     * 
     * @param {number} id - Id do livro.
     * @param {string} name - Nome do livro.
     * @param {string} author - Autor do livro.
     * @param {number} pages - Quantidade de páginas do livro.
     * @param {number} year - Ano do livro.
     * @param {number} stock - Quantidade de livros em estoque.
     * @returns {void}
     */
    addBook: (id, name, author, section, pages, year, stock) => {
        console.log(`localStorage: salvando livro "${name}"...`);
        const book = new Book(id, name, author, section, pages, year, stock);
        book.type = "Book";
        localStorage.setItem(id, JSON.stringify(book));
        console.log(`localStorage: livro "${name}" salvo com sucesso!`);
    },

    /**
     * Busca todos os livros.
     * 
     * @returns {Array} Array com todos os livros.
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
     * @returns {Object} Objeto do livro.
     * @returns {boolean} Retorna false se o livro não foi encontrado.
     */
    getBookById: (id) => {
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
     * @returns {boolean} Retorna true se o livro foi removido com sucesso.
     * @returns {boolean} Retorna false se o livro não foi encontrado.
     */
    removeBookById: (id) => {
        console.log(`localStorage: removendo livro com id "${id}"...`);
        const book = Books.getBookById(id);

        if (book) {
            if (book.lentTo.length > 0) {
                const student = Students.getStudentById(book.lentTo);
                const lentBook = student.lentBook;
                const lentBookSize = Object.keys(lentBook).length;
                for (let i = 0; i < lentBookSize; i++) {
                    if (lentBook[i].id == book.id) {
                        delete lentBook[i];
                    }
                }
                Students.updateStudent(student);
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
     * Atualiza um livro no localStorage.
     *  
     * @param {Object} book - Objeto do livro.
     */
    updateBook: (book) => {
        console.log(`localStorage: atualizando livro "${book.name}"...`);
        localStorage.setItem(book.id, JSON.stringify(book));
        console.log(`localStorage: livro "${book.name}" atualizado com sucesso!`);
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
        const lentBookSize = Object.keys(student.lentBook).length;

        for (let i = 0; i < lentBookSize; i++) {
            if (student.lentBook[i].id == book.id) {
                alert(`O estudante "${student.name}" já está com o livro "${book.name}" emprestado.`);
                throw new Error(`O estudante "${student.name}" já está com o livro "${book.name}" emprestado.`);
            }
        }

        if (book.stock <= 0) {
            alert(`O livro "${book.name}" não está em estoque.`);
            throw new Error(`O livro "${book.name}" não está em estoque.`);
        }
    
        book.stock--;
        book.lent = true;
        book.lentTo.push(studentId);
    
        const updatedLentBook = {...student.lentBook, [lentBookSize]: {id: bookId, lentDate: lentDate.replaceAll("-", "/")}};
        student.lentBook = updatedLentBook;

        Books.updateBook(book);
        Students.updateStudent(student);
        console.log(`localStorage: livro "${bookId}" emprestado para o estudante "${studentId}" com sucesso!`);
    },

    /**
     * Devolve um livro.
     * 
     * @param {Object} book - Objeto do livro.
     * @param {Object} student - Objeto do estudante.
     * @returns {void}
     */
    returnBook: (book, student) => {
        console.log(`localStorage: devolvendo livro "${book.name}" do estudante "${student.name}"...`);
        book.stock++;

        const index = book.lentTo.indexOf(student.id);
        book.lentTo.splice(index, 1);
        if (book.lentTo.length < 1) {
            book.lent = false;
        }
    
        const lentBook = student.lentBook;
        const lentBookSize = Object.keys(lentBook).length;
    
        for (let i = 0; i < lentBookSize; i++) {
            if (lentBook[i].id == book.id) {
                delete lentBook[i];
            }
        }
    
        student.lentBook = lentBook;
    
        Books.updateBook(book);
        Students.updateStudent(student);
        console.log(`localStorage: livro "${book.name}" devolvido do estudante "${student.name}" com sucesso!`);
    }
});

export { Books }