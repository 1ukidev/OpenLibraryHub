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
                const student = Students.getStudentById(bookObject.lentTo);
                td.innerHTML = `Emprestado para: ${student.name} (${student.schoolClass})`;
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
        emprestimo.innerHTML = "Livro Emprestado";

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

            if(studentObject.lentBook != null){
                let td = DOM.element("td");
                const book = Books.getBookById(studentObject.lentBook)
                td.innerHTML = `Sim / ${book.name}`;
                tr.appendChild(td);
            } else {
                let td = DOM.element("td");
                td.innerHTML = "nenhum";
                tr.appendChild(td)
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