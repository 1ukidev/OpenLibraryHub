/**
 * OpenLibraryHub
 * 
 * @version 0.3.6
 * @license GPL-3.0-or-later
 * @author 1ukidev <me@1uki.cloud>
 * @author Leonardo Monteiro <leo.monteiro06@live.com>
 */

// Variáveis globais --------------------------------------------
const divLock = document.getElementById("lock");
const divHeader = document.getElementById("header");
const divContent = document.getElementById("content");
const divFooter = document.getElementById("footer");
const version = "0.3.6";

// Páginas ------------------------------------------------------
const Pages = Object.freeze({
    /**
     * Altera o hash do site.
     * O método Pages.route() será executado para alterar a página.
     * 
     * @param {string} hash - Hash da página.
     * @returns {void}
     */
    changePage: (hash) => {
        location.hash = hash;
    },

    /**
     * Altera a página de acordo com o hash.
     * 
     * @returns {void}
     */
    route: () => {
        Locks.checkLock();
        switch (location.hash) {
            case "":
                Pages.openMainContent();
                break;
            case "#livros":
                Pages.openBookPage();
                break;
            case "#estudantes":
                Pages.openStudentPage();
                break;
            case "#turmas":
                Pages.openClassPage();
                break;
            default:
                Pages.openMainContent();
                break;
        }
    },

    /**
     * Abre a tela para a criação da senha de bloqueio.
     * Esta é a primeira página ao abrir pela primeira vez o site.
     * 
     * @returns {void}
     */
    openCreateLock: () => {
        if (localStorage.getItem("lock") != null) {
            console.error("localStorage: já existe um bloqueio criado!");
            return false;
        }

        divLock.innerHTML = `
            <h1>Bem-vindo ao OpenLibraryHub (${version})!</h1>
            <h2>Crie uma senha antes de começar:</h2>
            <input type="password" id="password" placeholder="Senha">
            <button id="submit" onclick="(async () => await Locks.createLock())()">Cadastrar</button>
        `;

        const submit = document.getElementById("password");
        submit.focus();
        submit.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("submit").click();
            }
        });
    },

    /**
     * Abre o bloqueio.
     * 
     * @returns {void}
     */
    openLockScreen: () => {
        if (JSON.parse(localStorage.getItem("lock")).status == "unlocked") {
            console.error("localStorage: o bloqueio já foi desbloqueado!");
            return false;
        } else if (localStorage.getItem("lock") == null) {
            console.error("localStorage: não existe um bloqueio criado!");
            return false;
        }

        divLock.innerHTML = `
            <h1>Bem-vindo ao OpenLibraryHub (${version})!</h1>
            <h2>Insira a senha cadastrada para continuar:</h2>
            <input type="password" id="password" placeholder="Senha">
            <button id="submit" onclick="(async () => await Locks.unlock())()">Entrar</button>
        `;

        const submit = document.getElementById("password");
        submit.focus();
        submit.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("submit").click();
            }
        });
    },

    /**
     * Abre o cabeçalho principal.
     * 
     * @returns {void}
     */
    openMainHeader: () => {
        Locks.checkLock();
        divHeader.innerHTML = `
            <ul>
                <li><a onclick="Pages.changePage('#')" class="a-1">&nbsp;📖 Status&nbsp;</a></li>
                <li><a onclick="Pages.changePage('livros')" class="a-2">&nbsp;📚 Livros&nbsp;</a></li>
                <li><a onclick="Pages.changePage('turmas')" class="a-3">&nbsp;🏫 Turmas&nbsp;</a></li>
                <li><a onclick="Pages.changePage('estudantes')" class="a-4">&nbsp;🧑 Estudantes&nbsp;</a></li>
                <li><a onclick="Locks.lock()" class="a-5">&nbsp;🔒 Sair&nbsp;</a></li>
            </ul>
            <br>
        `;
    },

    /**
     * Abre o conteúdo principal.
     * Hash padrão: #
     * 
     * @returns {void}
     */
    openMainContent: () => {
        Locks.checkLock();
        divContent.innerHTML = `
            <b><span class="generic-text" id="main-text-1" style="font-size: 24px;"></span></b>
            <br><br>
            <b><span class="generic-text" id="main-text-2" style="font-size: 24px;"></span></b>
        `;

        const mainText1 = document.getElementById("main-text-1");
        const hours = new Date().getHours();

        if (hours >= 8 && hours < 12) {
            mainText1.innerHTML = "Bom dia! ";
        } else if (hours >= 12 && hours < 18) {
            mainText1.innerHTML = "Boa tarde! ";
        } else {
            mainText1.innerHTML = "Boa noite! ";
        }

        const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
        mainText1.innerHTML += new Date().toLocaleString('pt-BR', opcoes);

        const mainText2 = document.getElementById("main-text-2");
        mainText2.innerHTML = "Alunos que estão com livros emprestados: ";
        const lentBooks = [];
        const students = Students.getAllStudents();

        for (let i = 0; i < students.length; i++) {
            const studentObject = JSON.parse(students[i]);

            if (studentObject.type === "Student" && studentObject.lentBook !== null) {
                const bookObject = Books.getBookById(studentObject.lentBook);
                lentBooks.push(`${studentObject.name} - ${studentObject.schoolClass} - ${bookObject.name} - Data de entrega: ${bookObject.lentDate}`);
            }
        }

        if (lentBooks.length > 0) {
            const ul = document.createElement("ul");

            lentBooks.forEach(book => {
                const li = document.createElement("li");
                li.textContent = book;
                ul.appendChild(li);
            });

            mainText2.appendChild(ul);
        } else {
            mainText2.innerHTML += "nenhum...";
        }
    },

    /**
     * Abre a página de livros.
     * Hash padrão: #livros
     * 
     * @returns {void}
     */
    openBookPage: () => {
        Locks.checkLock();
        divContent.innerHTML = `
            <div id="form1">
                <label for="bookName">Adicionar livro:</label>
                <input type="text" id="bookName" placeholder="Nome">
                <input type="text" id="bookAuthor" placeholder="Autor">
                <input type="number" id="bookPages" placeholder="Quantidade de páginas" onkeydown="return Others.numberMask(event)">
                <input type="number" id="bookYear" placeholder="Ano" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm1()">Adicionar</button>
            </div>
            <br>

            <div id="form2">
                <label for="bookId">Verificar se o livro está cadastro pelo id:</label>
                <input type="number" id="bookId" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm2()">Buscar</button>
            </div>
            <br>

            <div id="form7">
                <label for="bookId2">Emprestar livro de id:</label>
                <input type="number" id="bookId2" onkeydown="return Others.numberMask(event)">
                <label for="studentId">para o estudante de id:</label>
                <input type="number" id="studentId" onkeydown="return Others.numberMask(event)">
                <label for="lentDate">Data de entrega:</label>
                <input type="date" id="lentDate">
                <button onclick="Forms.runForm7()">Emprestar</button>
            </div>
            <br>

            <div id="form8">
                <label for="bookId3">Verificar se está emprestado o livro de id:</label>
                <input type="number" id="bookId3" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm8()">Buscar</button>
            </div>
            <br>

            <div id="form9">
                <label for="bookId4">Devolver livro de id:</label>
                <input type="number" id="bookId4" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm9()">Devolver</button>
            </div>
            <br>

            <div id="form10">
                <label for="bookId5">Remover livro de id:</label>
                <input type="number" id="bookId5" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm10()">Remover</button>
            </div>
            <br>

            <button onclick="Others.deleteLocalStorage()">Resetar tudo</button>
            <button onclick="Others.makeBackupLocalStorage()">Fazer backup dos dados</button>
            <button onclick="(async () => await Others.checkUpdate())()">Verificar se há atualizações</button>

            <h2>Lista de livros:</h2>
            <ul id="bookList"></ul>
        `;

        Lists.showBookList();
    },

    /**
     * Abre a página de estudantes.
     * Hash padrão: #estudantes
     * 
     * @returns {void}
     */
    openStudentPage: () => {
        Locks.checkLock();
        divContent.innerHTML = `
            <div id="form3">
                <label for="studentName">Adicionar estudante:</label>
                <input type="text" id="studentName" placeholder="Nome">
                <select id="studentClass">
                    <option value="" disabled selected>Selecione a turma</option>
                </select>
                <button onclick="Forms.runForm3()">Adicionar</button>
            </div>
            <br>

            <div id="form4">
                <label for="studentId">Verificar se o estudante está cadastrado pelo id:</label>
                <input type="number" id="studentId" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm4()">Buscar</button>
            </div>
            <br>

            <div id="form11">
                <label for="studentId2">Remover estudante de id:</label>
                <input type="number" id="studentId2" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm11()">Remover</button>
            </div>
            <br>

            <button onclick="Others.deleteLocalStorage()">Resetar tudo</button>
            <button onclick="Others.makeBackupLocalStorage()">Fazer backup dos dados</button>
            <button onclick="(async () => await Others.checkUpdate())()">Verificar se há atualizações</button>

            <h2>Lista de estudantes:</h2>
            <ul id="studentList"></ul>
        `;

        Classes.getAllClasses().forEach((schoolClass) => {
            const option = document.createElement("option");
            const schoolClassObject = JSON.parse(schoolClass);
            option.textContent = schoolClassObject.name;
            document.getElementById("studentClass").appendChild(option);
        });

        Lists.showStudentList();
    },

    /**
     * Abre a página de turmas.
     * Hash padrão: #turmas
     * 
     * @returns {void}
     */
    openClassPage: () => {
        Locks.checkLock();
        divContent.innerHTML = `
            <div id="form5">
                <label for="className">Adicionar turma:</label>
                <input type="text" id="className" placeholder="Ex.: 3º Info">
                <button onclick="Forms.runForm5()">Adicionar</button>
            </div>
            <br>

            <div id="form6">
                <label for="classId">Verificar se a turma está cadastrada pelo id:</label>
                <input type="number" id="classId" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm6()">Buscar</button>
            </div>
            <br>

            <div id="form12">
                <label for="classId2">Remover turma de id:</label>
                <input type="number" id="classId2" onkeydown="return Others.numberMask(event)">
                <button onclick="Forms.runForm12()">Remover</button>
            </div>
            <br>

            <button onclick="Others.deleteLocalStorage()">Resetar tudo</button>
            <button onclick="Others.makeBackupLocalStorage()">Fazer backup dos dados</button>
            <button onclick="(async () => await Others.checkUpdate())()">Verificar se há atualizações</button>

            <h2>Lista de turmas:</h2>
            <ul id="classList"></ul>
            <br>
        `;

        Lists.showClassList();
    }
});

// Classes abstratas --------------------------------------------
/**
 * Representa um bloqueio.
 * 
 * @constructor
 * @param {string} password - Senha do bloqueio.
 * @param {string} status - Status do bloqueio.
 */
const Lock = class {
    constructor(password, status) {
        this.password = password;
        this.status = status;
    }
}

/**
 * Representa um livro.
 * 
 * @constructor
 * @param {number} id - Id do livro.
 * @param {string} name - Nome do livro.
 * @param {string} author - Autor do livro.
 * @param {number} pages - Quantidade de páginas do livro.
 * @param {number} year - Ano do livro.
 * @param {boolean} lent - Se o livro está emprestado. Padrão: false.
 * @param {number} lentTo - Id do estudante que pegou o livro emprestado. Padrão: null.
 * @param {string} lentDate - Data de entrega do livro. Padrão: null.
 */
const Book = class {
    constructor(id, name, author, pages, year) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.pages = pages;
        this.year = year;
        this.lent = false;
        this.lentTo = null;
        this.lentDate = null;
    }
}

/**
 * Representa um estudante.
 * 
 * @constructor
 * @param {number} id - Id do estudante.
 * @param {string} name - Nome do estudante.
 * @param {string} schoolClass - Turma do estudante.
 * @param {number} lentBook - Id do livro que o estudante pegou emprestado. Padrão: null.
 */ 
const Student = class {
    constructor(id, name, schoolClass) {
        this.id = id;
        this.name = name;
        this.schoolClass = schoolClass;
        this.lentBook = null;
    }
}

/**
 * Representa uma turma.
 * 
 * @constructor
 * @param {number} id - Id da turma.
 * @param {string} name - Nome da turma.
 */
const Class = class {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

// localStorage -------------------------------------------------
const Books = Object.freeze({
    /**
     * Adiciona um livro ao localStorage.
     * 
     * @param {number} id - Id do livro.
     * @param {string} name - Nome do livro.
     * @param {string} author - Autor do livro.
     * @param {number} pages - Quantidade de páginas do livro.
     * @param {number} year - Ano do livro.
     * @returns {void}
     */
    addBook: (id, name, author, pages, year) => {
        console.log(`localStorage: salvando livro "${name}"...`);
        const book = new Book(id, name, author, pages, year);
        book.type = "Book";
        localStorage.setItem(localStorage.length++, JSON.stringify(book));
        console.log(`localStorage: livro "${name}" salvo com sucesso!`);
    },

    /**
     * Busca todos os livros.
     * 
     * @returns {Array} - Array com todos os livros.
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
     * @returns {Object} - Objeto do livro.
     * @returns {boolean} - Retorna false se o livro não foi encontrado.
     */
    getBookById: (id) => {
        console.log(`localStorage: procurando livro com id "${id}"...`);
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
     * @returns {boolean} - Retorna true se o livro foi removido com sucesso.
     */
    removeBookById: (id) => {
        console.log(`localStorage: removendo livro com id "${id}"...`);
        const book = Books.getBookById(id);
        if (book) {
            if (book.lentTo != null) {
                const student = Students.getStudentById(book.lentTo);
                student.lentBook = null;
                localStorage.setItem(student.id, JSON.stringify(student));
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
        book.lent = true;
        book.lentTo = studentId;
        book.lentDate = lentDate.replace("-", "/").replace("-", "/");
        student.lentBook = bookId;
        localStorage.setItem(bookId, JSON.stringify(book));
        localStorage.setItem(studentId, JSON.stringify(student));
        console.log(`localStorage: livro "${bookId}" emprestado para o estudante "${studentId}" com sucesso!`);
    }
});

const Students = Object.freeze({
    /**
     * Adiciona um estudante ao localStorage.
     * 
     * @param {number} id - Id do estudante.
     * @param {string} name - Nome do estudante.
     * @param {string} schoolClass - Turma do estudante.
     * @returns {void}
     */
    addStudent: (id, name, schoolClass) => {
        console.log(`localStorage: salvando estudante "${name}"...`);
        const student = new Student(id, name, schoolClass);
        student.type = "Student";
        localStorage.setItem(localStorage.length++, JSON.stringify(student));
        console.log(`localStorage: estudante "${name}" salvo com sucesso!`);
    },

    /**
     * Busca todos os estudantes.
     * 
     * @returns {Array} - Array com todos os estudantes.
     */
    getAllStudents: () => {
        const students = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const student = localStorage.getItem(key);
            const studentObject = JSON.parse(student);
            if (studentObject.type == "Student") {
                students.push(student);
            }
        }
        return students;
    },

    /**
     * Busca um estudante pelo o seu id.
     * 
     * @param {number} id - Id do estudante.
     * @returns {Object} - Objeto do estudante.
     * @returns {boolean} - Retorna false se o estudante não foi encontrado.
     */
    getStudentById: (id) => {
        console.log(`localStorage: procurando estudante com id "${id}"...`);
        const student = localStorage.getItem(id);
        const studentObject = JSON.parse(student);

        if (student && studentObject.type == "Student") {
            return studentObject;
        } else {
            console.error(`localStorage: estudante com id "${id}" não encontrado...`);
            return false;
        }
    },

    /**
     * Remove um estudante pelo o seu id.
     * 
     * @param {number} id - Id do estudante.
     * @returns {boolean} - Retorna true se o estudante foi removido com sucesso.
     */
    removeStudentById: (id) => {
        console.log(`localStorage: removendo estudante com id "${id}"...`);
        const student = Students.getStudentById(id);
        if (student) {
            if (student.lentBook != null) {
                const book = Books.getBookById(student.lentBook);
                book.lent = false;
                book.lentTo = null;
                book.lentDate = null;
                localStorage.setItem(book.id, JSON.stringify(book));
            }

            localStorage.removeItem(id);
            Lists.showStudentList();
            console.log(`localStorage: estudante removido com sucesso!`);
            return true;
        } else {
            alert(`O estudante com id "${id}" não foi encontrado.`);
            console.error(`localStorage: estudante com id "${id}" não encontrado...`);
            return false;
        }
    }
});

const Classes = Object.freeze({
    /**
     * Adiciona uma turma ao localStorage.
     * 
     * @param {number} id - Id da turma.
     * @param {string} name - Nome da turma.
     */
    addClass: (id, name) => {
        console.log(`localStorage: salvando turma "${name}"...`);
        const schoolClass = new Class(id, name);
        schoolClass.type = "Class";
        localStorage.setItem(localStorage.length++, JSON.stringify(schoolClass));
        console.log("localStorage: turma '" + name + "' salva com sucesso!");
    },

    /**
     * Busca todas as turmas.
     * 
     * @returns {Array} - Array com todas as turmas.
     */
    getAllClasses: () => {
        const classes = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const schoolClass = localStorage.getItem(key);
            const schoolClassObject = JSON.parse(schoolClass);
            if (schoolClassObject.type == "Class") {
                classes.push(schoolClass);
            }
        }
        return classes;
    },

    /**
     * Busca uma turma pelo o seu id.
     * 
     * @param {number} id - Id da turma.
     * @returns {Object} - Objeto da turma.
     * @returns {boolean} - Retorna false se a turma não foi encontrada.
     */
    getClassById: (id) => {
        console.log(`localStorage: procurando turma com id "${id}"...`);
        const schoolClass = localStorage.getItem(id);
        const schoolClassObject = JSON.parse(schoolClass);

        if (schoolClass && schoolClassObject.type == "Class") {
            return schoolClassObject;
        } else {
            console.error(`localStorage: turma com id "${id}" não encontrada...`);
            return false;
        }
    },

    /**
     * Remove uma turma pelo o seu id.
     * 
     * @param {number} id - Id da turma.
     * @returns {boolean} - Retorna true se a turma foi removida com sucesso. 
     */
    removeClassById: (id) => {
        console.log(`localStorage: removendo turma com id "${id}"...`);
        const schoolClass = Classes.getClassById(id);
        if (schoolClass) {
            localStorage.removeItem(id);
            Lists.showClassList();
            console.log(`localStorage: turma removida com sucesso!`);
            return true;
        } else {
            alert(`A turma com id "${id}" não foi encontrada.`);
            console.error(`localStorage: turma com id "${id}" não encontrada...`);
            return false;
        }
    }
});

// Formulários --------------------------------------------------
const Forms = Object.freeze({
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
            Books.addBook(localStorage.length++, bookName.value, bookAuthor.value, bookPages.value, bookYear.value);
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
            Students.addStudent(localStorage.length++, studentName.value, studentClass.value);
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
            Classes.addClass(localStorage.length++, className.value);
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

// Listas -------------------------------------------------------
const Lists = Object.freeze({
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

// Outros -------------------------------------------------------
const Others = Object.freeze({
    /**
     * Verifica se há atualizações.
     * 
     * @returns {void}
     */
    checkUpdate: async () => {
        console.log("Verificando atualizações...");
        const response = await fetch("https://raw.githubusercontent.com/1ukidev/OpenLibraryHub/main/VERSION");
        const data = await response.text();
      
        console.log(`Versão atual: ${version}`);
        console.log(`Retorno: ${data}`);
      
        if (data.trim() == version) {
            alert("Você está usando a versão mais recente!");
            console.log("Você está usando a versão mais recente!");
        } else {
            alert("Há uma atualização disponível! Acesse 'https://github.com/1ukidev/OpenLibraryHub' para baixar a nova versão.");
            console.log("Há uma atualização disponível! Acesse 'https://github.com/1ukidev/OpenLibraryHub' para baixar a nova versão.");
        }
    },

    /**
     * Faz backup dos dados do localStorage.
     * 
     * @returns {boolean} - Retorna true se o backup foi feito com sucesso.
     */
    makeBackupLocalStorage: () => {
        console.log("Fazendo backup...");
        let values;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            values += localStorage.getItem(key);
        }
        if (values == undefined || values == null) {
            alert("Erro ao fazer backup: nenhum dado encontrado.");
            console.error("Erro ao fazer backup: nenhum dado encontrado.");
            return false;
        }
        const valuesBase64 = btoa(values.replace("undefined", ""));
    
        const link = document.createElement("a");
        link.href = `data:text/plain;base64,${valuesBase64}`;
        link.download = "OpenLibraryHubBackup.txt";
        link.click();
    
        console.log("Backup feito com sucesso!");
    },

    /**
     * Apaga todos os dados do localStorage.
     * 
     * @returns {void}
     */
    deleteLocalStorage: () => {
        console.log("localStorage: apagando todos os dados...");
        Locks.checkLock();
        localStorage.clear();
        location.href = "";
    },

    /**
     * Máscara para inputs de números.
     * 
     * @param {*} event - Evento do input.
     * @returns {boolean} - Retorna true se o input for um número.
     */
    numberMask: (event) => {
        const validKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
        
        if (validKeys.includes(event.code)) {
            return true;
        } else if (!isNaN(Number(event.key)) && event.code !== 'Space') {
            return true;
        } else {
            return false;
        }
    }
});

const Locks = Object.freeze({
    /**
     * Salva a senha do input no localStorage e desbloqueia a página.
     * 
     * @async
     * @returns {void}
     */
    createLock: async () => {
        console.log("Criando bloqueio...");
        const password = document.getElementById("password").value;

        if (password) {
            const passwordHash = await Locks.SHA256(password);
            const lock = new Lock(passwordHash, "unlocked");
            localStorage.setItem("lock", JSON.stringify(lock));
            divLock.innerHTML = "";
            Pages.openMainHeader();
            Pages.route()
        } else {
            alert('Insira uma senha válida!');
        }
    },

    /**
     * Desbloqueia a página com a senha inserida no input.
     * 
     * @async
     * @returns {void}
     */
    unlock: async () => {
        console.log("Desbloqueando...");
        const password = document.getElementById("password").value;

        if (password) {
            const lock = JSON.parse(localStorage.getItem("lock"));
            const passwordHash = await Locks.SHA256(password);

            if (lock.password == passwordHash) {
                lock.status = "unlocked";
                localStorage.setItem("lock", JSON.stringify(lock));
                divLock.innerHTML = "";
                Pages.openMainHeader();
                Pages.route();
                console.log("Desbloqueado com sucesso!");
            } else {
                alert("Senha incorreta!");
            }
        } else {
            alert("Insira uma senha válida!");
        }
    },

    /**
     * Bloqueia a página.
     * Após o bloqueio, o usuário irá desbloquear utilizando a senha cadastrada.
     * 
     * @returns {void}
     */
    lock: () => {
        console.log("Bloqueando...");
        const lock = JSON.parse(localStorage.getItem("lock"));
        lock.status = "locked";
        localStorage.setItem("lock", JSON.stringify(lock));
        divHeader.innerHTML = "";
        divContent.innerHTML = "";
        divFooter.innerHTML = "";
        Pages.openLockScreen();
        console.log("Bloqueado com sucesso!");
    },

    /**
     * Verifica se a página está bloqueada.
     * 
     * @returns {void}
     */
    checkLock: () => {
        if (JSON.parse(localStorage.getItem("lock")).status == "locked") {
            throw new Error("localStorage: a página está bloqueada!");
        }
    },

    /**
     * Criptografa uma senha com SHA256.
     * 
     * @async
     * @param {string} password - Senha a ser criptografada.
     * @returns {string} - Retorna a senha criptografada.
     */
    SHA256: async (password) => {
        const msgBuffer = new TextEncoder().encode(password);                    
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});

// Inicialização da página -------------------------------------
document.body.onload = () => {
    console.log(`Inicializando OpenLibraryHub (${version})...`);

    if (localStorage.getItem("lock") == null) {
        Pages.openCreateLock();
    } else {
        const lock = JSON.parse(localStorage.getItem("lock"));
        if (lock && lock.status == "unlocked") {
            Pages.openMainHeader();
            Pages.route();
        } else {
            Pages.openLockScreen();
        }
    }

    console.log("Inicializado com sucesso!");
}