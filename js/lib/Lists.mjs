import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";
import { DOM } from "./DOM.mjs";

const Lists = Object.freeze({
    /**
     * Mostra todos os livros no elemento bookList.
     * 
     * @returns {void}
     */
    showBookList: () => {
        const bookList = DOM.id("bookList");
        const books = Books.getAllBooks();

        bookList.innerHTML = "";
        books.forEach((book) => {
            const li = DOM.element("li");
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
    },

    /**
     * Mostra todos os estudantes no elemento studentList.
     * 
     * @returns {void}
     */
    showStudentList: () => {
        const studentList = DOM.id("studentList");
        const students = Students.getAllStudents();

        studentList.innerHTML = "";
        students.forEach((student) => {
            const li = DOM.element("li");
            const studentObject = JSON.parse(student);
            li.textContent = "Nome: " + studentObject.name;
            li.textContent += " / Turma: " + studentObject.schoolClass;
            li.textContent += " / Livro emprestado: " + studentObject.lentBook;
            li.textContent += " / Id: " + studentObject.id;
            studentList.appendChild(li);
        });
    },

    /**
     * Mostra todas as turmas no elemento classList.
     * 
     * @returns {void}
     */
    showClassList: () => {
        const classList = DOM.id("classList");
        const classes = Classes.getAllClasses();

        classList.innerHTML = "";
        classes.forEach((schoolClass) => {
            const li = DOM.element("li");
            const schoolClassObject = JSON.parse(schoolClass);
            li.textContent = "Nome: " + schoolClassObject.name;
            li.textContent += " / Id: " + schoolClassObject.id;
            classList.appendChild(li);
        });
    },

    /**
     * Mostra todos os livros no elemento bookList.
     * Método para estudantes.
     * 
     * @returns {void}
     */
    showBookListForStudents: () => {
        const bookList = DOM.id("bookList");
        const books = Books.getAllBooks();

        bookList.innerHTML = "";
        books.forEach((book) => {
            const li = DOM.element("li");
            const bookObject = JSON.parse(book);
            li.style = "font-size: 16px;";
            li.textContent = `Nome: ${bookObject.name}`;
            li.textContent += ` / Autor: ${bookObject.author}`;
            li.textContent += ` / Páginas: ${bookObject.pages}`;
            li.textContent += ` / Ano: ${bookObject.year}`;
            bookList.appendChild(li);
        });
    },

    /**
     * Adiciona a funcionalidade de busca no input selecionado.
     * 
     * @param {HTMLElement} ul - Elemento HTML que contém a lista.
     * @param {HTMLElement} input - Elemento HTML que contém o input de busca.
     * @returns {void}
     */
    addSearch: (input, ul) => {
        input.onkeyup = () => {
            const searchValue = search.value.toUpperCase();
            const lis = ul.getElementsByTagName("li");

            for (let i = 0; i < lis.length; i++) {
                const li = lis[i];
                const txtValue = li.textContent || li.innerText;

                if (txtValue.toUpperCase().indexOf(searchValue) > -1) {
                    li.style.display = "";
                } else {
                    li.style.display = "none";
                }
            }
        }
    }
});

export { Lists };