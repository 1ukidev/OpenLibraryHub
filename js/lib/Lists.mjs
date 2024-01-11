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
    showBookList: (search, filterType) => {
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
        let secao = DOM.element("th");
        secao.innerHTML = "Seção";
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
        tr.appendChild(secao);
        tr.appendChild(ano);
        tr.appendChild(paginas);
        tr.appendChild(estoque);
        tr.appendChild(estado);

        thead.appendChild(tr)

        if(search != null && search != "TODOS"){
            const regex = new RegExp(search.replace(/%/g, ".*"), "i");

            const filteredBooks = books.filter((book) => {
                const bookObject = JSON.parse(book);

                if(filterType == "bookName"){
                    return regex.test(bookObject.name);
                } else if(filterType == "bookSection") {
                    return regex.test(bookObject.section);
                }
                
            });

            filteredBooks.forEach((filteredBook) => {
                const bookObject = JSON.parse(filteredBook);

                let tr = DOM.element("tr");

                tr.innerHTML = `
                    <td>${bookObject.id}</td>
                    <td>${bookObject.name}</td>
                    <td>${bookObject.author}</td>
                    <td>${bookObject.section}</td>
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
                    tr.appendChild(td);
                } else {
                    let td = DOM.element("td");
                    td.innerHTML = "Disponivel";
                    tr.appendChild(td);
                }

                if(DOM.id("formEditBook") != null || DOM.id("formLendBook") != null || DOM.id("formReturnBook") != null || DOM.id("formRemoveBook") != null){
                    let td = DOM.element("td");
                    td.innerHTML = "<button class='button selecionarLivro'>selecionar</button>";
                    tr.appendChild(td);
                }

                tbody.appendChild(tr);
            });
        } else {
            books.forEach(book => {
                const bookObject = JSON.parse(book);
    
                let tr = DOM.element("tr");
    
                tr.innerHTML = `
                    <td>${bookObject.id}</td>
                    <td>${bookObject.name}</td>
                    <td>${bookObject.author}</td>
                    <td>${bookObject.section}</td>
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
                    tr.appendChild(td);
                } else {
                    let td = DOM.element("td");
                    td.innerHTML = "Disponivel";
                    tr.appendChild(td);
                }

                if(DOM.id("formEditBook") != null || DOM.id("formLendBook") != null || DOM.id("formReturnBook") != null || DOM.id("formRemoveBook") != null){
                    let td = DOM.element("td");
                    td.innerHTML = "<button class='button selecionarLivro'>selecionar</button>";
                    tr.appendChild(td);
                }
    
                tbody.appendChild(tr);
            });
        }

        table.appendChild(thead);
        table.appendChild(tbody);

        let containers = document.querySelectorAll(".table-container");
        if(containers.length>0){
            containers[0].innerHTML = "";
            containers[0].appendChild(table);
        } else {
            let lastContainer = containers[containers.length - 1];
            lastContainer.innerHTML = "";
            lastContainer.appendChild(table);
        }
    },

    /**
     * Mostra todos os estudantes no elemento studentList.
     * 
     * @returns {void}
     */
    showStudentList: (search) => {
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

        if(search != null){
            const regex = new RegExp(search.replace(/%/g, ".*"), "i");
    
            const filteredStudent = students.filter((student) => {
                const studentObject = JSON.parse(student);
    
                return regex.test(studentObject.name);
            });
    
            filteredStudent.forEach((filteredStudent) => {
                let tr = DOM.element("tr");
    
                const studentObject = JSON.parse(filteredStudent);
    
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

                if(DOM.id("formLendBook") != null || DOM.id("formReturnBook") != null || DOM.id("formEditStudent") != null || DOM.id("formRemoveStudent") != null){
                    let td = DOM.element("td");
                    td.innerHTML = "<button class='button selecionarEstudante'>selecionar</button>";
                    tr.appendChild(td);
                }
                
                tbody.appendChild(tr);
            });
        } else {
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

                if(DOM.id("formLendBook") != null || DOM.id("formReturnBook") != null || DOM.id("formEditStudent") != null || DOM.id("formRemoveStudent") != null){
                    let td = DOM.element("td");
                    td.innerHTML = "<button class='button selecionarEstudante'>selecionar</button>";
                    tr.appendChild(td);
                }
                
                tbody.appendChild(tr);
            });
        }

        table.appendChild(thead);
        table.appendChild(tbody);

        let containers = document.querySelectorAll(".table-container");
        let lastContainer = containers[containers.length - 1];
        lastContainer.innerHTML = "";
        lastContainer.appendChild(table);
    },

    /**
     * Mostra todas as turmas no elemento classList.
     * 
     * @returns {void}
     */
    showClassList: (search) => {
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
    
        if(search != null){
            const regex = new RegExp(search.replace(/%/g, ".*"), "i");
    
            const filteredClasses = classes.filter((schoolClass) => {
                const schoolClassObject = JSON.parse(schoolClass);
    
                return regex.test(schoolClassObject.name);
            });
    
            filteredClasses.forEach((filteredClass) => {
                let tr = DOM.element("tr");
    
                const schoolClassObject = JSON.parse(filteredClass);
    
                tr.innerHTML = `
                    <td>${schoolClassObject.id}</td>
                    <td>${schoolClassObject.name}</td>
                `;
    
                tbody.appendChild(tr);
            });
        } else {
            classes.forEach((schoolClass) => {
                let tr = DOM.element("tr");
    
                const schoolClassObject = JSON.parse(schoolClass);
    
                tr.innerHTML = `
                    <td>${schoolClassObject.id}</td>
                    <td>${schoolClassObject.name}</td>
                `;
    
                tbody.appendChild(tr);
            });
        }
    
        table.appendChild(thead);
        table.appendChild(tbody);
    
        let containers = document.querySelectorAll(".table-container");
        let lastContainer = containers[containers.length - 1];
        lastContainer.innerHTML = "";
        lastContainer.appendChild(table);
    },

    /**
     * Mostra todos os livros no elemento bookList.
     * Método para estudantes.
     * 
     * @returns {void}
     */
    showBookListForStudents: (search) => {
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

        if(search != null){
            const regex = new RegExp(search.replace(/%/g, ".*"), "i");

            const filteredBooks = books.filter((book) => {
                const bookObject = JSON.parse(book);

                return regex.test(bookObject.name);
            });

            filteredBooks.forEach((filteredBook) => {
                const bookObject = JSON.parse(filteredBook);

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
                    tr.appendChild(td);
                } else {
                    let td = DOM.element("td");
                    td.innerHTML = "Disponivel";
                    tr.appendChild(td);
                }

                tbody.appendChild(tr);
            });
        } else {
            books.forEach(book => {
                const bookObject = JSON.parse(book);
    
                let tr = DOM.element("tr");
    
                tr.innerHTML = `
                    <td>${bookObject.id}</td>
                    <td>${bookObject.name}</td>
                    <td>${bookObject.author}</td>
                    <td>${bookObject.section}</td>
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
                    tr.appendChild(td);
                } else {
                    let td = DOM.element("td");
                    td.innerHTML = "Disponivel";
                    tr.appendChild(td);
                }
    
                tbody.appendChild(tr);
            });
        }

        table.appendChild(thead);
        table.appendChild(tbody);
    
        let containers = document.querySelectorAll(".table-container");
        let lastContainer = containers[containers.length - 1];
        lastContainer.innerHTML = "";
        lastContainer.appendChild(table);
    },

    /**
     * Adiciona a lista de livros.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addBookList: (idSearch = ["bookSearch", "sectionSearch"]) => {
        const section = document.createElement('section');
        section.innerHTML = `
            <h2>Lista de livros:</h2>
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="${idSearch[0]}">
            <select id="${idSearch[1]}">
                <option>todos</option>
            </select>
            <div class="table-container"></div>
        `;

        DOM.divs.content.appendChild(section);

        Lists.showBookList();
        Lists.addSearch(DOM.id(idSearch[0]));
        Lists.addSearch(DOM.id(idSearch[1]));

        const sections = [];
        const table = document.querySelectorAll(".table-container")[0];

        table.childNodes[0].childNodes[1].childNodes.forEach(row => {
           let section = row.children[3].textContent
            if(sections.length == 0){
                sections.push(section)
            } else {
                if(!sections.includes(section)){
                    sections.push(section)
                }
            }
        })

        sections.forEach(section => {
            const option = DOM.element("option");
            option.innerHTML = section
            DOM.id("sectionSearch").appendChild(option)
        })
    },

    /**
     * Adiciona a lista de estudantes.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addStudentList: (idSearch = "studentSearch") => {
        const section = document.createElement('section');
        section.innerHTML = `
            <h2>Lista de estudantes:</h2>
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="${idSearch}">
            <div class="table-container"></div>
        `;

        DOM.divs.content.appendChild(section);

        Lists.showStudentList();
        Lists.addSearch(DOM.id(idSearch));
    },

    /**
     * Adiciona a lista de turmas.
     * 
     * @param {string} [idSearch="search"] - Id do elemento input de busca.
     * @returns {void}
     */
    addClassList: (idSearch = "classSearch") => {
        const section = document.createElement('section');
        section.innerHTML = `
            <h2>Lista de livros:</h2>
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="${idSearch}">
            <div class="table-container"></div>
        `;

        DOM.divs.content.appendChild(section);

        Lists.showClassList();
        Lists.addSearch(DOM.id(idSearch));
    },

    /**
     * Adiciona a funcionalidade de busca no input selecionado.
     * TODO: Fix this
     * 
     * @param {HTMLElement} ul - Elemento HTML que contém a lista.
     * @param {HTMLElement} input - Elemento HTML que contém o input de busca.
     * @returns {void}
     */

    addSearch: (input) => {
        //const table = input.parentNode.children[3];
        if(input.id == "sectionSearch"){
            input.addEventListener("change", () => {
                const searchValue = input.value.toUpperCase();
                Lists.showBookList(searchValue, "bookSection");
            })
        } else {
            input.onkeyup = () => {
                const searchValue = input.value.toUpperCase();
    
                switch(input.id){
                    case 'bookSearch':
                        Lists.showBookList(searchValue, "bookName");
                        break;
                    case 'studentSearch':
                        Lists.showStudentList(searchValue);
                        break;
                    case 'classSearch':
                        Lists.showClassList(searchValue);
                        break;
                    default:
                        alert("erro na funcionalidade de pesquisa, informar desenvolvedores")
                }
            }
        }
        
    }
});

export { Lists };