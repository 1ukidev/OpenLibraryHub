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
        const books = Books.getAllBooks();

        const table = DOM.element("table");
        const thead = DOM.element("thead");
        const tbody = DOM.element("tbody");

        let tr = DOM.element("tr");

        let id = DOM.element("th");
        id.innerHTML = "Id";
        let nome = DOM.element("th");
        nome.innerHTML = "Nome";
        let autor = DOM.element("th");
        autor.innerHTML = "Autor";
        let ano = DOM.element("th");
        ano.innerHTML = "Ano";
        let paginas = DOM.element("th");
        paginas.innerHTML = "Páginas";
        let estoque = DOM.element("th");
        estoque.innerHTML = "Estoque";
        let estado = DOM.element("th");
        estado.innerHTML = "Estado";

        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(autor);
        tr.appendChild(ano);
        tr.appendChild(paginas);
        tr.appendChild(estoque);
        tr.appendChild(estado);

        thead.appendChild(tr)

        books.forEach(book => {
            const bookObject = JSON.parse(book);

            let tr = DOM.element("tr");

            tr.innerHTML = `
                <td>${bookObject.id}</td>
                <td>${bookObject.name}</td>
                <td>${bookObject.author}</td>
                <td>${bookObject.year}</td>
                <td>${bookObject.pages}</td>
                <td>${bookObject.stock}</td>
            `;

            if(bookObject.lent){
                let td = DOM.element("td");
                if (bookObject.lentTo.length == 1) {
                    td.innerHTML = `Emprestado para ${bookObject.lentTo.length} estudante`;
                } else {
                    td.innerHTML = `Emprestado para ${bookObject.lentTo.length} estudantes`;
                }
                tr.appendChild(td)
            } else {
                let td = DOM.element("td");
                td.innerHTML = "Disponivel";
                tr.appendChild(td)
            }

            tbody.appendChild(tr)
        })

        table.appendChild(thead);
        table.appendChild(tbody);

        let containers = document.querySelectorAll(".table-container");
        if(containers.length>0){
            containers[0].appendChild(table);
        } else {
            let lastContainer = containers[containers.length - 1];
            lastContainer.appendChild(table);
        }
    },

    /**
     * Mostra todos os estudantes no elemento studentList.
     * 
     * @returns {void}
     */
    showStudentList: () => {
        const students = Students.getAllStudents();

        const table = DOM.element("table");
        const thead = DOM.element("thead");
        const tbody = DOM.element("tbody");

        let tr = DOM.element("tr");

        let id = DOM.element("th");
        id.innerHTML = "Id";
        let nome = DOM.element("th");
        nome.innerHTML = "Nome";
        let turma = DOM.element("th");
        turma.innerHTML = "Turma";
        let emprestimo = DOM.element("th");
        emprestimo.innerHTML = "Livros emprestados";

        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(turma);
        tr.appendChild(emprestimo);

        thead.appendChild(tr)

        students.forEach(student => {
            let tr = DOM.element("tr");

            const studentObject = JSON.parse(student);
            
            tr.innerHTML = `
                <td>${studentObject.id}</td>
                <td>${studentObject.name}</td>
                <td>${studentObject.schoolClass}</td>
            `;

            const lentBookSize = Object.keys(studentObject.lentBook).length;
            if (lentBookSize > 0) {
                let td = DOM.element("td");
                for (let i = 0; i < lentBookSize; i++) {
                    const book = Books.getBookById(studentObject.lentBook[i].id);
                    td.innerHTML += book.name;
                    if (i < lentBookSize - 1) {
                        td.innerHTML += ' / ';
                    }
                }
                tr.appendChild(td);
            } else {
                let td = DOM.element("td");
                td.innerHTML = "nenhum";
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        let containers = document.querySelectorAll(".table-container");
        let lastContainer = containers[containers.length - 1];
        lastContainer.appendChild(table);
    },

    /**
     * Mostra todas as turmas no elemento classList.
     * 
     * @returns {void}
     */
    showClassList: () => {
        
        const classes = Classes.getAllClasses();
        
        const table = DOM.element("table");
        const thead = DOM.element("thead");
        const tbody = DOM.element("tbody");

        let tr = DOM.element("tr");

        let id = DOM.element("th");
        id.innerHTML = "Id";
        let nome = DOM.element("th");
        nome.innerHTML = "Nome";

        tr.appendChild(id);
        tr.appendChild(nome);
        
        thead.appendChild(tr);

        classes.forEach((schoolClass) => {
            let tr = DOM.element("tr");

            const schoolClassObject = JSON.parse(schoolClass);
            
            tr.innerHTML = `
                <td>${schoolClassObject.id}</td>
                <td>${schoolClassObject.name}</td>
            `;
            
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        
        let containers = document.querySelectorAll(".table-container");
        let lastContainer = containers[containers.length - 1];
        lastContainer.appendChild(table);
    },

    /**
     * Mostra todos os livros no elemento bookList.
     * Método para estudantes.
     * 
     * @returns {void}
     */
    showBookListForStudents: () => {
        DOM.id("lock").style.height = "0"
        const books = Books.getAllBooks();

        const table = DOM.element("table");
        const thead = DOM.element("thead");
        const tbody = DOM.element("tbody");

        let tr = DOM.element("tr");

        let id = DOM.element("th");
        id.innerHTML = "Id";
        let nome = DOM.element("th");
        nome.innerHTML = "Nome";
        let autor = DOM.element("th");
        autor.innerHTML = "Autor";
        let ano = DOM.element("th");
        ano.innerHTML = "Ano";
        let paginas = DOM.element("th");
        paginas.innerHTML = "Páginas";
        let estado = DOM.element("th");
        estado.innerHTML = "Estado";

        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(autor);
        tr.appendChild(ano);
        tr.appendChild(paginas);
        tr.appendChild(estado);

        thead.appendChild(tr)

        books.forEach(book => {
            const bookObject = JSON.parse(book);

            let tr = DOM.element("tr");

            tr.innerHTML = `
                <td>${bookObject.id}</td>
                <td>${bookObject.name}</td>
                <td>${bookObject.author}</td>
                <td>${bookObject.year}</td>
                <td>${bookObject.pages}</td>
            `;

            if(bookObject.lent){
                let td = DOM.element("td");
                if (bookObject.lentTo.length == 1) {
                    td.innerHTML = `Emprestado para ${bookObject.lentTo.length} estudante`;
                } else {
                    td.innerHTML = `Emprestado para ${bookObject.lentTo.length} estudantes`;
                }
                tr.appendChild(td)
            } else {
                let td = DOM.element("td");
                td.innerHTML = "Disponivel";
                tr.appendChild(td)
            }

            tbody.appendChild(tr)
        })

        table.appendChild(thead);
        table.appendChild(tbody);
        console.log(document.querySelector(".table-container"))
        document.querySelector(".table-container").appendChild(table);
    },

    /**
     * Adiciona a lista de livros.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addBookList: (idSearch = "search") => {
        DOM.divs.content.innerHTML += `
            <section>
                <h2>Lista de livros:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="${idSearch}">
                <div class="table-container"></div>
            </section>
        `;

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
            <section>
                <h2>Lista de estudantes:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="${idSearch}">
                <div class="table-container"></div>
            </section>
        `;

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
            <section>
                <h2>Lista de turmas:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="${idSearch}">
                <div class="table-container"></div>
            </section>
        `;

        Lists.showClassList();
    },

    /**
     * Adiciona a funcionalidade de busca no input selecionado.
     * TODO: Fix this
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