import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";
import { Lists } from "./Lists.mjs";

export const Forms = Object.freeze({
    /**
     * Executa o formulário (form1) para adicionar um livro.
     * 
     * @returns {boolean} - Retorna true se o livro foi adicionado com sucesso.
     */
    runForm1: () => {
        const bookName = document.getElementById("bookName");
        const bookAuthor = document.getElementById("bookAuthor");
        const bookPages = document.getElementById("bookPages");
        const bookYear = document.getElementById("bookYear");

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
     * Executa o formulário (form2) para verificar se um livro está cadastrado pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o livro está cadastrado.
     */
    runForm2: () => {
        const bookName = document.getElementById("bookId");

        if (bookName.value) {
            if (Books.getBookById(bookName.value)) {
                alert(`O livro com id "${bookName.value}" está cadastrado.`);
                return true;
            } else {
                alert(`O livro com id "${bookName.value}" não está cadastrado.`);
                return false;
            }
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    /**
     * Executa o formulário (form3) para adicionar um estudante.
     * 
     * @returns {boolean} - Retorna true se o estudante foi adicionado com sucesso.
     */
    runForm3: () => {
        const studentName = document.getElementById("studentName");
        const studentClass = document.getElementById("studentClass");

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
     * Executa o formulário (form4) para verificar se um estudante está cadastrado pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o estudante está cadastrado.
     */
    runForm4: () => {
        const studentId = document.getElementById("studentId");

        if (studentId.value) {
            if (Students.getStudentById(studentId.value)) {
                alert(`O estudante com id "${studentId.value}" está cadastrado.`);
                return true;
            } else {
                alert(`O estudante com id "${studentId.value}" não está cadastrado.`);
                return false;
            }
        } else {
            alert("Por favor, insira o id do estudante.");
            return false;
        }
    },

    /**
     * Executa o formulário (form5) para adicionar uma turma.
     * 
     * @returns {boolean} - Retorna true se a turma foi adicionada com sucesso.
     */
    runForm5: () => {
        const className = document.getElementById("className");

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
     * Executa o formulário (form6) para verificar se uma turma está cadastrada pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se a turma está cadastrada.
     */
    runForm6: () => {
        const classId = document.getElementById("classId");

        if (classId.value) {
            if (Classes.getClassById(classId.value)) {
                alert(`A turma com id "${classId.value}" está cadastrada.`);
                return true;
            } else {
                alert(`A turma com id "${classId.value}" não está cadastrada.`);
                return false;
            }
        } else {
            alert("Por favor, insira o id da turma.");
            return false;
        }
    },

    /**
     * Executa o formulário (form7) para emprestar um livro pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o livro foi emprestado com sucesso.
     */
    runForm7: () => {
        const bookId = document.getElementById("bookId2");
        const studentId = document.getElementById("studentId");
        const lentDate = document.getElementById("lentDate");

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
     * Executa o formulário (form8) para verificar se um livro está emprestado pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o livro está emprestado.
     */
    runForm8: () => {
        const bookId = document.getElementById("bookId3");

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
     * Executa o formulário (form9) para devolver um livro pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o livro foi devolvido com sucesso.
     */
    runForm9: () => {
        const bookId = document.getElementById("bookId4");

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
     * Executa o formulário (form10) para remover um livro pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o livro foi removido com sucesso.
     */
    runForm10: () => {
        const bookId = document.getElementById("bookId5");

        if (bookId.value) {
            Books.removeBookById(bookId.value);
            return true;
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    /**
     * Executa o formulário (form11) para remover um estudante pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se o estudante foi removido com sucesso.
     */
    runForm11: () => {
        const studentId = document.getElementById("studentId2");

        if (studentId.value) {
            Students.removeStudentById(studentId.value);
            return true;
        } else {
            alert("Por favor, insira o id do estudante.");
            return false;
        }
    },

    /**
     * Executa o formulário (form12) para remover uma turma pelo o seu id.
     * 
     * @returns {boolean} - Retorna true se a turma foi removida com sucesso.
     */
    runForm12: () => {
        const classId = document.getElementById("classId2");

        if (classId.value) {
            Classes.removeClassById(classId.value);
            return true;
        } else {
            alert("Por favor, insira o id da turma.");
            return false;
        }
    }
});