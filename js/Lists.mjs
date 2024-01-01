import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";

export const Lists = Object.freeze({
    /**
     * Mostra todos os livros no elemento bookList.
     * 
     * @returns {void}
     */
    showBookList: () => {
        try {
            const bookList = document.getElementById("bookList");
            const books = Books.getAllBooks();

            bookList.innerHTML = "";
            books.forEach((book) => {
                const li = document.createElement("li");
                const bookObject = JSON.parse(book);
                li.textContent = "Nome: " + bookObject.name;
                li.textContent += " / Autor: " + bookObject.author;
                li.textContent += " / Páginas: " + bookObject.pages;
                li.textContent += " / Ano: " + bookObject.year;
                li.textContent += " / Id: " + bookObject.id;
                li.textContent += " / Emprestado: " + bookObject.lent;
                li.textContent += " / Emprestado para: " + bookObject.lentTo;
                li.textContent += " / Data de entrega: " + bookObject.lentDate;
                bookList.appendChild(li);
            });
        } catch { }
    },

    /**
     * Mostra todos os estudantes no elemento studentList.
     * 
     * @returns {void}
     */
    showStudentList: () => {
        try {
            const studentList = document.getElementById("studentList");
            const students = Students.getAllStudents();

            studentList.innerHTML = "";
            students.forEach((student) => {
                const li = document.createElement("li");
                const studentObject = JSON.parse(student);
                li.textContent = "Nome: " + studentObject.name;
                li.textContent += " / Turma: " + studentObject.schoolClass;
                li.textContent += " / Livro emprestado: " + studentObject.lentBook;
                li.textContent += " / Id: " + studentObject.id;
                studentList.appendChild(li);
            });
        } catch { }
    },

    /**
     * Mostra todas as turmas no elemento classList.
     * 
     * @returns {void}
     */
    showClassList: () => {
        try {
            const classList = document.getElementById("classList");
            const classes = Classes.getAllClasses();

            classList.innerHTML = "";
            classes.forEach((schoolClass) => {
                const li = document.createElement("li");
                const schoolClassObject = JSON.parse(schoolClass);
                li.textContent = "Nome: " + schoolClassObject.name;
                li.textContent += " / Id: " + schoolClassObject.id;
                classList.appendChild(li);
            });
        } catch { }
    }
});