import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";
import { Lists } from "./Lists.mjs";
import { DOM } from "./DOM.mjs";

const Forms = Object.freeze({
    /**
     * Executa o formulário para adicionar um livro.
     * 
     * @returns {void}
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
        } else {
            alert("Por favor, insira todos os dados do livro.");
        }
    },

    /**
     * Executa o formulário para adicionar um estudante.
     * 
     * @returns {void}
     */
    runFormAddStudent: () => {
        const studentName = DOM.id("studentName");
        const studentClass = DOM.id("studentClass");

        if (studentName.value) {
            if (studentClass.value == null || studentClass.value == "" || studentClass.value == "Selecione a turma") {
                alert("Por favor, selecione a turma do estudante.");
                return;
            }
            Students.addStudent(localStorage.length, studentName.value, studentClass.value);
            studentName.value = "";
            Lists.showStudentList();
        } else {
            alert("Por favor, insira o nome do estudante.");
        }
    },

    /**
     * Executa o formulário para adicionar uma turma.
     * 
     * @returns {void}
     */
    runFormAddClass: () => {
        const className = DOM.id("className");

        if (className.value) {
            Classes.addClass(localStorage.length, className.value);
            className.value = "";
            Lists.showClassList();
        } else {
            alert("Por favor, insira o nome da turma.");
        }
    },

    /**
     * Executa o formulário para emprestar um livro pelo o seu id.
     * 
     * @returns {void}
     */
    runFormLendBook: () => {
        const bookId = DOM.id("bookId");
        const studentId = DOM.id("studentId");
        const lentDate = DOM.id("lentDate");

        if (bookId.value && studentId.value && lentDate.value) {
            if (Books.getBookById(bookId.value) && Students.getStudentById(studentId.value)) {
                Books.lendBook(bookId.value, studentId.value, lentDate.value);
                bookId.value = "";
                studentId.value = "";
                lentDate.value = "";
                Lists.showBookList();
                Lists.showStudentList();
                alert("Livro emprestado com sucesso!");
            } else {
                alert("O livro ou o estudante não está cadastrado.");
            }
        } else {
            alert("Por favor, insira todos os dados.");
        }
    },

    /**
     * Executa o formulário para devolver um livro pelo o seu id.
     * 
     * @returns {void}
     */
    runFormReturnBook: () => {
        const bookId = DOM.id("bookId");

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
                    Lists.showStudentList();
                    alert(`O livro com id "${bookId.value}" foi devolvido com sucesso!`);
                } else {
                    alert(`O livro com id "${bookId.value}" não está emprestado.`);
                }
            } else {
                alert(`O livro com id "${bookId.value}" não está cadastrado.`);
            }
        } else {
            alert("Por favor, insira o id do livro.");
        }
    },

    /**
     * Executa o formulário para editar um livro pelo o seu id.
     * 
     * @returns {void}
     */
    runFormEditBook: () => {
        const booksSelect = DOM.id("books");
        const booksSelectId = booksSelect.value.split(" - Id: ")[1];
        const bookName = DOM.id("bookName");
        const bookAuthor = DOM.id("bookAuthor");
        const bookPages = DOM.id("bookPages");
        const bookYear = DOM.id("bookYear");

        if (!booksSelectId) {
            alert("Por favor, selecione um livro.");
            return;
        }

        if (bookName.value && bookAuthor.value && bookPages.value && bookYear.value) {
            Books.addBook(booksSelectId, bookName.value, bookAuthor.value, bookPages.value, bookYear.value);
            booksSelect.value = "";
            bookName.value = "";
            bookAuthor.value = "";
            bookPages.value = "";
            bookYear.value = "";
            Lists.showBookList();
            alert("Livro editado com sucesso!");
        } else {
            alert("Por favor, insira todos os dados do livro.");
        }
    },

    /**
     * Executa o formulário para editar um estudante pelo o seu id.
     * 
     * @returns {void}
     */
    runFormEditStudent: () => {
        const studentsSelect = DOM.id("students");
        const studentsSelectId = studentsSelect.value.split(" - Id: ")[1];
        const studentName = DOM.id("studentName");
        const studentClass = DOM.id("studentClass");

        if (!studentsSelectId) {
            alert("Por favor, selecione um estudante.");
            return;
        }

        if (studentName.value) {
            if (studentClass.value == null || studentClass.value == "" || studentClass.value == "Selecione a turma") {
                alert("Por favor, selecione a turma do estudante.");
                return;
            }
            Students.addStudent(studentsSelectId, studentName.value, studentClass.value);
            studentsSelect.value = "";
            studentName.value = "";
            studentClass.value = "";
            Lists.showStudentList();
            alert("Estudante editado com sucesso!");
        } else {
            alert("Por favor, insira o nome do estudante.");
        }
    },

    /**
     * Executa o formulário para editar um estudante pelo o seu id.
     * 
     * @returns {void}
     */
    runFormEditClass: () => {
        const classesSelect = DOM.id("classes");
        const classesSelectId = classesSelect.value.split(" - Id: ")[1];
        const className = DOM.id("className");

        if (!classesSelectId) {
            alert("Por favor, selecione uma turma.");
            return;
        }

        if (className.value) {
            Classes.addClass(classesSelectId, className.value);
            classesSelect.value = "";
            className.value = "";
            Lists.showClassList();
            alert("Turma editada com sucesso!");
        } else {
            alert("Por favor, insira o nome da turma.");
        }
    },

    /**
     * Executa o formulário para remover um livro pelo o seu id.
     * 
     * @returns {void}
     */
    runFormRemoveBook: () => {
        const bookId = DOM.id("bookId");

        if (bookId.value) {
            Books.removeBookById(bookId.value);
        } else {
            alert("Por favor, insira o id do livro.");
        }
    },

    /**
     * Executa o formulário para remover um estudante pelo o seu id.
     * 
     * @returns {void}
     */
    runFormRemoveStudent: () => {
        const studentId = DOM.id("studentId");

        if (studentId.value) {
            Students.removeStudentById(studentId.value);
        } else {
            alert("Por favor, insira o id do estudante.");
        }
    },

    /**
     * Executa o formulário para remover uma turma pelo o seu id.
     * 
     * @returns {void}
     */
    runFormRemoveClass: () => {
        const classId = DOM.id("classId");

        if (classId.value) {
            Classes.removeClassById(classId.value);
        } else {
            alert("Por favor, insira o id da turma.");
        }
    }
});

export { Forms };