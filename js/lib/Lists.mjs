import { Books } from "./Book/Books.mjs";
import { Students } from "./Student/Students.mjs";
import { Classes } from "./Class/Classes.mjs";
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
            li.textContent = `Nome: ${bookObject.name}`;
            li.textContent += ` / Autor: ${bookObject.author}`;
            li.textContent += ` / Ano: ${bookObject.year}`;
            li.textContent += ` / Páginas: ${bookObject.pages}`;
            li.textContent += ` / Quantidade em estoque: ${bookObject.stock}`;
            li.textContent += ` / Id: ${bookObject.id}`;
            if (bookObject.lent) {
                li.textContent += " / Emprestado? Sim";
            } else {
                li.textContent += " / Emprestado? Não";
            }
            if (bookObject.lentTo != null && bookObject.lentTo.length > 0) {
                li.textContent += ` / Emprestado para: ${bookObject.lentTo.length}`;
                if (bookObject.lentTo.length > 1) {
                    li.textContent += " estudantes";
                }
            }
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
            li.textContent = `Nome: ${studentObject.name}`;
            li.textContent += ` / Turma: ${studentObject.schoolClass}`;
            li.textContent += ` / Id: ${studentObject.id}`;
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
            li.textContent = `Nome: ${schoolClassObject.name}`;
            li.textContent += ` / Id: ${schoolClassObject.id}`;
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
            li.textContent += ` / Ano: ${bookObject.year}`;
            li.textContent += ` / Páginas: ${bookObject.pages}`;
            li.textContent += ` / Quantidade em estoque: ${bookObject.stock}`;
            bookList.appendChild(li);
        });
    },

    /**
     * Adiciona a lista de livros.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addBookList: (idSearch = "search") => {
        DOM.divs.content.innerHTML += `
            <h2>Lista de livros:</h2>
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="${idSearch}">
            <ul id="bookList"></ul>
        `;

        const search = DOM.id(idSearch);
        const bookList = DOM.id("bookList");
        Lists.addSearch(search, bookList);
        Lists.showBookList();
    },

    /**
     * Adiciona a lista de estudantes.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addStudentList: (idSearch = "search") => {
        DOM.divs.content.innerHTML += `
            <h2>Lista de estudantes:</h2>
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="${idSearch}">
            <ul id="studentList"></ul>
        `;

        const search2 = DOM.id(idSearch);
        const studentList = DOM.id("studentList");
        Lists.addSearch(search2, studentList);
        Lists.showStudentList();
    },

    /**
     * Adiciona a lista de turmas.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addClassList: (idSearch = "search") => {
        DOM.divs.content.innerHTML += `
            <h2>Lista de turmas:</h2>
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="${idSearch}">
            <ul id="classList"></ul>
        `;

        const search = DOM.id(idSearch);
        const classList = DOM.id("classList");
        Lists.addSearch(search, classList);
        Lists.showClassList();
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