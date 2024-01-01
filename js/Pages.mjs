import { DOM } from "./DOM.mjs";
import { Locks } from "./Locks.mjs";
import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";
import { Lists } from "./Lists.mjs";
import { Others } from "./Others.mjs";
import { Forms } from "./Forms.mjs";
import { version } from "./Constants.mjs";

export const Pages = Object.freeze({
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

        DOM.divs.lock.innerHTML = `
            <h1>Bem-vindo ao OpenLibraryHub (${version})!</h1>
            <h2>Crie uma senha antes de começar:</h2>
            <input type="password" id="password" placeholder="Senha">
            <button id="submit">Cadastrar</button>
        `;

        const password = document.getElementById("password");
        const submit = document.getElementById("submit");

        password.focus();
        password.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("submit").click();
            }
        });

        submit.onclick = async () => await Locks.createLock();
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

        DOM.divs.lock.innerHTML = `
            <h1>Bem-vindo ao OpenLibraryHub (${version})!</h1>
            <h2>Insira a senha cadastrada para continuar:</h2>
            <input type="password" id="password" placeholder="Senha">
            <button id="submit">🚪 Entrar</button>
            <h2>É aluno e deseja ver os livros disponíveis? <a id="btn1" class="btn1">Clique aqui!</a></h2>
        `;

        const password = document.getElementById("password");
        const submit = document.getElementById("submit");
        const btn1 = document.getElementById("btn1");

        password.focus();
        password.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submit.click();
            }
        });

        btn1.onclick = () => {
            DOM.divs.lock.innerHTML = "";
            Pages.openAllBooksPage();
        }

        submit.onclick = async () => await Locks.unlock();
    },

    /**
     * Abre o cabeçalho principal.
     * 
     * @returns {void}
     */
    openMainHeader: () => {
        Locks.checkLock();

        DOM.divs.header.innerHTML = `
            <ul>
                <li><a id="a-1" class="a-1">&nbsp;📖 Status&nbsp;</a></li>
                <li><a id="a-2" class="a-2">&nbsp;📚 Livros&nbsp;</a></li>
                <li><a id="a-3" class="a-3">&nbsp;🏫 Turmas&nbsp;</a></li>
                <li><a id="a-4" class="a-4">&nbsp;🧑 Estudantes&nbsp;</a></li>
                <li><a id="a-5" class="a-5">&nbsp;🔒 Sair&nbsp;</a></li>
            </ul>
            <br>
        `;

        document.getElementById("a-1").onclick = () => Pages.changePage("");
        document.getElementById("a-2").onclick = () => Pages.changePage("#livros");
        document.getElementById("a-3").onclick = () => Pages.changePage("#turmas");
        document.getElementById("a-4").onclick = () => Pages.changePage("#estudantes");
        document.getElementById("a-5").onclick = () => Locks.lock();
    },

    /**
     * Abre o conteúdo principal.
     * Hash padrão: #
     * 
     * @returns {void}
     */
    openMainContent: () => {
        Locks.checkLock();

        DOM.divs.content.innerHTML = `
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

        DOM.divs.content.innerHTML = `
            <div id="form1">
                <label for="bookName">Adicionar livro:</label>
                <input type="text" id="bookName" placeholder="Nome">
                <input type="text" id="bookAuthor" placeholder="Autor">
                <input type="number" id="bookPages" placeholder="Quantidade de páginas">
                <input type="number" id="bookYear" placeholder="Ano">
                <button id="btnForm1">Adicionar</button>
            </div>
            <br>

            <div id="form2">
                <label for="bookId">Verificar se o livro está cadastro pelo id:</label>
                <input type="number" id="bookId">
                <button id="btnForm2">Buscar</button>
            </div>
            <br>

            <div id="form7">
                <label for="bookId2">Emprestar livro de id:</label>
                <input type="number" id="bookId2">
                <label for="studentId">para o estudante de id:</label>
                <input type="number" id="studentId">
                <label for="lentDate">Data de entrega:</label>
                <input type="date" id="lentDate">
                <button id="btnForm7">Emprestar</button>
            </div>
            <br>

            <div id="form8">
                <label for="bookId3">Verificar se está emprestado o livro de id:</label>
                <input type="number" id="bookId3">
                <button id="btnForm8">Buscar</button>
            </div>
            <br>

            <div id="form9">
                <label for="bookId4">Devolver livro de id:</label>
                <input type="number" id="bookId4">
                <button id="btnForm9">Devolver</button>
            </div>
            <br>

            <div id="form10">
                <label for="bookId5">Remover livro de id:</label>
                <input type="number" id="bookId5">
                <button id="btnForm10">Remover</button>
            </div>
            <br>

            <button id="btnResetAll">Resetar tudo</button>
            <button id="btnMakeBackup">Fazer backup dos dados</button>
            <button id="btnCheckUpdate">Verificar se há atualizações</button>

            <h2>Lista de livros:</h2>
            <ul id="bookList"></ul>
        `;

        document.getElementById("btnForm1").onclick = () => Forms.runForm1();
        document.getElementById("btnForm2").onclick = () => Forms.runForm2();
        document.getElementById("btnForm7").onclick = () => Forms.runForm7();
        document.getElementById("btnForm8").onclick = () => Forms.runForm8();
        document.getElementById("btnForm9").onclick = () => Forms.runForm9();
        document.getElementById("btnForm10").onclick = () => Forms.runForm10();
        document.getElementById("btnResetAll").onclick = () => Others.deleteLocalStorage();
        document.getElementById("btnMakeBackup").onclick = () => Others.makeBackupLocalStorage();
        document.getElementById("btnCheckUpdate").onclick = async () => await Others.checkUpdate();

        document.getElementById("bookId").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("bookId2").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("studentId").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("bookId3").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("bookId4").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("bookId5").onkeydown = (event) => Others.numberMask(event);

        const bookName = document.getElementById("bookName");
        const bookAuthor = document.getElementById("bookAuthor");
        const bookPages = document.getElementById("bookPages");
        const bookYear = document.getElementById("bookYear");
        const btnForm1 = document.getElementById("btnForm1");

        bookName.focus();
        bookName.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                bookAuthor.focus();
            }
        });
        bookAuthor.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                bookPages.focus();
            }
        });
        bookPages.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                bookYear.focus();
            } else if (!Others.numberMask(event)) {
                event.preventDefault();
            }
        });
        bookYear.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                btnForm1.click();
                bookName.focus();
            } else if (!Others.numberMask(event)) {
                event.preventDefault();
            }
        });

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

        DOM.divs.content.innerHTML = `
            <div id="form3">
                <label for="studentName">Adicionar estudante:</label>
                <input type="text" id="studentName" placeholder="Nome">
                <select id="studentClass">
                    <option value="" disabled selected>Selecione a turma</option>
                </select>
                <button id="btnForm3">Adicionar</button>
            </div>
            <br>

            <div id="form4">
                <label for="studentId">Verificar se o estudante está cadastrado pelo id:</label>
                <input type="number" id="studentId">
                <button id="btnForm4">Buscar</button>
            </div>
            <br>

            <div id="form11">
                <label for="studentId2">Remover estudante de id:</label>
                <input type="number" id="studentId2">
                <button id="btnForm11">Remover</button>
            </div>
            <br>

            <button id="btnResetAll">Resetar tudo</button>
            <button id="btnMakeBackup">Fazer backup dos dados</button>
            <button id="btnCheckUpdate">Verificar se há atualizações</button>

            <h2>Lista de estudantes:</h2>
            <ul id="studentList"></ul>
        `;

        document.getElementById("btnForm3").onclick = () => Forms.runForm3();
        document.getElementById("btnForm4").onclick = () => Forms.runForm4();
        document.getElementById("btnForm11").onclick = () => Forms.runForm11();
        document.getElementById("btnResetAll").onclick = () => Others.deleteLocalStorage();
        document.getElementById("btnMakeBackup").onclick = () => Others.makeBackupLocalStorage();
        document.getElementById("btnCheckUpdate").onclick = async () => await Others.checkUpdate();

        document.getElementById("studentId").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("studentId2").onkeydown = (event) => Others.numberMask(event);

        Classes.getAllClasses().forEach((schoolClass) => {
            const option = document.createElement("option");
            const schoolClassObject = JSON.parse(schoolClass);
            option.textContent = schoolClassObject.name;
            document.getElementById("studentClass").appendChild(option);
        });

        const studentName = document.getElementById("studentName");
        const studentClass = document.getElementById("studentClass");

        studentName.focus();
        studentName.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                studentClass.focus();
            }
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

        DOM.divs.content.innerHTML = `
            <div id="form5">
                <label for="className">Adicionar turma:</label>
                <input type="text" id="className" placeholder="Ex.: 3º Info">
                <button id="btnForm5">Adicionar</button>
            </div>
            <br>

            <div id="form6">
                <label for="classId">Verificar se a turma está cadastrada pelo id:</label>
                <input type="number" id="classId">
                <button id="btnForm6">Buscar</button>
            </div>
            <br>

            <div id="form12">
                <label for="classId2">Remover turma de id:</label>
                <input type="number" id="classId2">
                <button id="btnForm12">Remover</button>
            </div>
            <br>

            <button id="btnResetAll">Resetar tudo</button>
            <button id="btnMakeBackup">Fazer backup dos dados</button>
            <button id="btnCheckUpdate">Verificar se há atualizações</button>

            <h2>Lista de turmas:</h2>
            <ul id="classList"></ul>
            <br>
        `;

        document.getElementById("btnForm5").onclick = () => Forms.runForm5();
        document.getElementById("btnForm6").onclick = () => Forms.runForm6();
        document.getElementById("btnForm12").onclick = () => Forms.runForm12();
        document.getElementById("btnResetAll").onclick = () => Others.deleteLocalStorage();
        document.getElementById("btnMakeBackup").onclick = () => Others.makeBackupLocalStorage();
        document.getElementById("btnCheckUpdate").onclick = async () => await Others.checkUpdate();

        document.getElementById("classId").onkeydown = (event) => Others.numberMask(event);
        document.getElementById("classId2").onkeydown = (event) => Others.numberMask(event);

        const className = document.getElementById("className");
        const btnForm5 = document.getElementById("btnForm5");

        className.focus();
        className.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                btnForm5.click();
                className.focus();
            }
        });

        Lists.showClassList();
    },

    /**
     * Abre a página que exibe todos os livros (para estudantes).
     * 
     * @returns {void}
     */
    openAllBooksPage: () => {
        DOM.divs.others.innerHTML = `
            <br>
            <button id="back">◀️ Voltar</button>
            <h1>Lista de livros:</h1>
            <label for="search">Pesquise pelo nome:</label>
            <input type="text" id="search">
            <ul id="bookList"></ul>
        `;

        const books = Books.getAllBooks();
        const bookList = document.getElementById("bookList");
        const search = document.getElementById("search");
        const back = document.getElementById("back");

        books.forEach((book) => {
            const bookObject = JSON.parse(book);

            if (bookObject.type === "Book") {
                const li = document.createElement("li");
                li.style = "font-size: 18px;";
                li.textContent = `Nome: ${bookObject.name}`;
                li.textContent += ` / Autor: ${bookObject.author}`;
                li.textContent += ` / Páginas: ${bookObject.pages}`;
                li.textContent += ` / Ano: ${bookObject.year}`;
                bookList.appendChild(li);
            }
        });

        search.onkeyup = () => {
            const searchValue = search.value.toUpperCase();
            const lis = bookList.getElementsByTagName("li");

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

        back.onclick = () => {
            DOM.divs.others.innerHTML = "";
            Pages.openLockScreen();
        }
    }
});