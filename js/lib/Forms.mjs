import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";
import { Lists } from "./Lists.mjs";
import { DOM } from "./DOM.mjs";

const Forms = Object.freeze({
    /**
     * Executa o formulário para adicionar um livro.
     * 
     * @returns {boolean} Retorna true se o livro foi adicionado com sucesso.
     * @returns {boolean} Retorna false se o livro não foi adicionado.
     */
    runFormAddBook: () => {
        const bookName = DOM.id("bookName");
        const bookAuthor = DOM.id("bookAuthor");
        const bookPages = DOM.id("bookPages");
        const bookYear = DOM.id("bookYear");

        if (bookName.value && bookAuthor.value && bookPages.value && bookYear.value) {
            Books.addBook(localStorage.length, bookName.value, bookAuthor.value, bookPages.value, bookYear.value);
            bookName.value = "";
            bookAuthor.value = "";
            bookPages.value = "";
            bookYear.value = "";
            Lists.showBookList();
            return true;
        } else {
            alert("Por favor, insira todos os dados do livro.");
            return false;
        }
    },

    /**
     * Executa o formulário para adicionar um estudante.
     * 
     * @returns {boolean} Retorna true se o estudante foi adicionado com sucesso.
     * @returns {boolean} Retorna false se o estudante não foi adicionado.
     */
    runFormAddStudent: () => {
        const studentName = DOM.id("studentName");
        const studentClass = DOM.id("studentClass");

        if (studentName.value) {
            if (studentClass.value == null || studentClass.value == "" || studentClass.value == "Selecione a turma") {
                alert("Por favor, selecione a turma do estudante.");
                return false;
            }
            Students.addStudent(localStorage.length, studentName.value, studentClass.value);
            studentName.value = "";
            Lists.showStudentList();
            return true;
        } else {
            alert("Por favor, insira o nome do estudante.");
            return false;
        }
    },

    /**
     * Executa o formulário para adicionar uma turma.
     * 
     * @returns {boolean} Retorna true se a turma foi adicionada com sucesso.
     * @returns {boolean} Retorna false se a turma não foi adicionada.
     */
    runFormAddClass: () => {
        const className = DOM.id("className");

        if (className.value) {
            Classes.addClass(localStorage.length, className.value);
            className.value = "";
            Lists.showClassList();
            return true;
        } else {
            alert("Por favor, insira o nome da turma.");
            return false;
        }
    },

    /**
     * Executa o formulário para emprestar um livro pelo o seu id.
     * 
     * @returns {boolean} Retorna true se o livro foi emprestado com sucesso.
     * @returns {boolean} Retorna false se o livro não foi emprestado.
     */
    runFormLendBook: () => {
        const bookId = DOM.id("bookId2");
        const studentId = DOM.id("studentId");
        const lentDate = DOM.id("lentDate");

        if (bookId.value && studentId.value && lentDate.value) {
            if (Books.getBookById(bookId.value) && Students.getStudentById(studentId.value)) {
                Books.lendBook(bookId.value, studentId.value, lentDate.value);
                bookId.value = "";
                studentId.value = "";
                lentDate.value = "";
                Lists.showBookList();
                alert("Livro emprestado com sucesso!");
                return true;
            } else {
                alert("O livro ou o estudante não está cadastrado.");
                return false;
            }
        } else {
            alert("Por favor, insira todos os dados.");
            return false;
        }
    },

    /**
     * Executa o formulário para verificar se um livro está emprestado pelo o seu id.
     * 
     * @returns {boolean} Retorna true se o livro está emprestado.
     * @returns {boolean} Retorna false se o livro não está emprestado.
     */
    runFormCheckLentBook: () => {
        const bookId = DOM.id("bookId3");

        if (bookId.value) {
            const book = Books.getBookById(bookId.value);
            if (book) {
                if (book.lent) {
                    alert(`O livro com id "${bookId.value}" está emprestado para o estudante com id "${book.lentTo}".`);
                    return true;
                } else {
                    alert(`O livro com id "${bookId.value}" não está emprestado.`);
                    return false;
                }
            } else {
                alert(`O livro com id "${bookId.value}" não está cadastrado.`);
                return false;
            }
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    /**
     * Executa o formulário para devolver um livro pelo o seu id.
     * 
     * @returns {boolean} Retorna true se o livro foi devolvido com sucesso.
     * @returns {boolean} Retorna false se o livro não foi devolvido.
     */
    runFormReturnBook: () => {
        const bookId = DOM.id("bookId4");

        if (bookId.value) {
            const book = Books.getBookById(bookId.value);

            if (book) {
                if (book.lent) {
                    const student = Students.getStudentById(book.lentTo);
                    book.lent = false;
                    book.lentTo = null;
                    book.lentDate = null;
                    student.lentBook = null;
                    localStorage.setItem(bookId.value, JSON.stringify(book));
                    localStorage.setItem(student.id, JSON.stringify(student));
                    Lists.showBookList();
                    alert(`O livro com id "${bookId.value}" foi devolvido com sucesso!`);
                    return true;
                } else {
                    alert(`O livro com id "${bookId.value}" não está emprestado.`);
                    return false;
                }
            } else {
                alert(`O livro com id "${bookId.value}" não está cadastrado.`);
                return false;
            }
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    /**
     * Executa o formulário para remover um livro pelo o seu id.
     * 
     * @returns {boolean} Retorna true se o livro foi removido com sucesso.
     * @returns {boolean} Retorna false se o livro não foi removido.
     */
    runFormRemoveBook: () => {
        const bookId = DOM.id("bookId5");

        if (bookId.value) {
            Books.removeBookById(bookId.value);
            return true;
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    /**
     * Executa o formulário para remover um estudante pelo o seu id.
     * 
     * @returns {boolean} Retorna true se o estudante foi removido com sucesso.
     * @returns {boolean} Retorna false se o estudante não foi removido.
     */
    runFormRemoveStudent: () => {
        const studentId = DOM.id("studentId2");

        if (studentId.value) {
            Students.removeStudentById(studentId.value);
            return true;
        } else {
            alert("Por favor, insira o id do estudante.");
            return false;
        }
    },

    /**
     * Executa o formulário para remover uma turma pelo o seu id.
     * 
     * @returns {boolean} Retorna true se a turma foi removida com sucesso.
     * @returns {boolean} Retorna false se a turma não foi removida.
     */
    runFormRemoveClass: () => {
        const classId = DOM.id("classId2");

        if (classId.value) {
            Classes.removeClassById(classId.value);
            return true;
        } else {
            alert("Por favor, insira o id da turma.");
            return false;
        }
    }
});

export { Forms };