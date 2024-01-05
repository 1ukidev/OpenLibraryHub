import { DOM } from "./DOM.mjs";
import { Locks } from "./Lock/Locks.mjs";
import { Books } from "./Book/Books.mjs";
import { BookPages } from "./Book/BookPages.mjs";
import { Students } from "./Student/Students.mjs";
import { StudentPages } from "./Student/StudentPages.mjs";
import { ClassPages } from "./Class/ClassPages.mjs";
import { Lists } from "./Lists.mjs";
import { Others } from "./Others.mjs";
import { version } from "./Constants.mjs";

const RootPages = Object.freeze({
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
                RootPages.openMainContent();
                break;
            case "#livros":
                RootPages.openBookPage();
                break;
            case "#estudantes":
                RootPages.openStudentPage();
                break;
            case "#turmas":
                RootPages.openClassPage();
                break;
            case "#outros":
                RootPages.openOthersPage();
                break;
            default:
                RootPages.openMainContent();
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
            throw new Error("localStorage: já existe um bloqueio criado!");
        }

        DOM.divs.lock.innerHTML = `
            <h1>Bem-vindo ao OpenLibraryHub (${version})!</h1>
            <h2>Crie uma senha antes de começar:</h2>
            <input type="password" id="password" placeholder="Senha">&nbsp;
            <button id="submit">🚪 Cadastrar</button>
        `;

        const password = DOM.id("password");
        const submit = DOM.id("submit");

        password.focus();
        password.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submit.click();
            }
        });

        submit.onclick = () => Locks.createLock();
    },

    /**
     * Abre o bloqueio.
     * 
     * @returns {void}
     */
    openLockScreen: () => {
        if (JSON.parse(localStorage.getItem("lock")).status == "unlocked") {
            throw new Error("localStorage: o bloqueio já foi desbloqueado!");
        } else if (localStorage.getItem("lock") == null) {
            throw new Error("localStorage: não existe um bloqueio criado!");
        }

        DOM.divs.lock.innerHTML = `
            <h1>Bem-vindo ao OpenLibraryHub (${version})!</h1>
            <h2>É aluno e deseja ver os livros disponíveis? <a id="linkOpenAllBooks" class="linkOpenAllBooks">Clique aqui!</a></h2>
            <h2>Insira a senha cadastrada para continuar:</h2>
            <input type="password" id="password" placeholder="Senha">&nbsp;
            <button id="submit">🚪 Entrar</button>
        `;

        const password = DOM.id("password");
        const submit = DOM.id("submit");
        const linkOpenAllBooks = DOM.id("linkOpenAllBooks");

        password.focus();
        password.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submit.click();
            }
        });

        linkOpenAllBooks.onclick = () => {
            DOM.divs.lock.innerHTML = "";
            RootPages.openAllBooksPage();
        }

        submit.onclick = () => Locks.unlock();
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
                <li><a id="a-5" class="a-5">&nbsp;🔧 Outros&nbsp;</a></li>
                <li><a id="a-6" class="a-6">&nbsp;🔒 Sair&nbsp;</a></li>
            </ul>
            <br>
        `;

        DOM.id("a-1").onclick = () => RootPages.changePage("");
        DOM.id("a-2").onclick = () => RootPages.changePage("#livros");
        DOM.id("a-3").onclick = () => RootPages.changePage("#turmas");
        DOM.id("a-4").onclick = () => RootPages.changePage("#estudantes");
        DOM.id("a-5").onclick = () => RootPages.changePage("#outros");
        DOM.id("a-6").onclick = () => Locks.lock();
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

        const mainText1 = DOM.id("main-text-1");
        const hours = new Date().getHours();

        if (hours >= 8 && hours < 12) {
            mainText1.innerHTML = "Bom dia! ";
        } else if (hours >= 12 && hours < 18) {
            mainText1.innerHTML = "Boa tarde! ";
        } else {
            mainText1.innerHTML = "Boa noite! ";
        }

        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        mainText1.innerHTML += new Date().toLocaleString('pt-BR', dateOptions);

        const mainText2 = DOM.id("main-text-2");
        mainText2.innerHTML = "Livros emprestados: ";
        const lentBooks = [];
        const students = Students.getAllStudents();

        for (let i = 0; i < students.length; i++) {
            const studentObject = JSON.parse(students[i]);
            const size = Object.keys(studentObject.lentBook).length;

            for (let j = 0; j < size; j++) {
                const bookId = studentObject.lentBook[j].id;
                const lentDate = studentObject.lentBook[j].lentDate;
                const bookObject = Books.getBookById(bookId);
                lentBooks.push(`${bookObject.name} (emprestado para ${studentObject.name} (${studentObject.schoolClass}) em ${lentDate})`);
            }
        }

        if (lentBooks.length > 0) {
            const ul = DOM.element("ul");

            lentBooks.forEach(book => {
                const li = DOM.element("li");
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
            <button id="btnOpenSaveBookForm">Adicionar livro</button>&nbsp;&nbsp;
            <button id="btnOpenLendBookForm">Emprestar um livro</button>&nbsp;&nbsp;
            <button id="btnOpenReturnBookForm">Devolver livro</button>&nbsp;&nbsp;
            <button id="btnOpenEditBookForm">Editar livro</button>&nbsp;&nbsp;
            <button id="btnOpenRemoveBookForm">Remover livro</button>
            <br>
        `;

        Lists.addBookList();

        DOM.id("btnOpenSaveBookForm").onclick = () => BookPages.openSaveBookForm();
        DOM.id("btnOpenLendBookForm").onclick = () => BookPages.openLendBookForm();
        DOM.id("btnOpenReturnBookForm").onclick = () => BookPages.openReturnBookForm();
        DOM.id("btnOpenEditBookForm").onclick = () => BookPages.openEditBookForm();
        DOM.id("btnOpenRemoveBookForm").onclick = () => BookPages.openRemoveBookForm();
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
            <button id="btnOpenSaveStudentForm">Adicionar estudante</button>&nbsp;&nbsp;
            <button id="btnOpenEditStudentForm">Editar estudante</button>&nbsp;&nbsp;
            <button id="btnOpenRemoveStudentForm">Remover estudante</button>
            <br>
        `;

        Lists.addStudentList();

        DOM.id("btnOpenSaveStudentForm").onclick = () => StudentPages.openSaveStudentForm();
        DOM.id("btnOpenEditStudentForm").onclick = () => StudentPages.openEditStudentForm();
        DOM.id("btnOpenRemoveStudentForm").onclick = () => StudentPages.openRemoveStudentForm();
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
            <button id="btnOpenSaveClassForm">Adicionar turma</button>&nbsp;&nbsp;
            <button id="btnOpenEditClassForm">Editar turma</button>&nbsp;&nbsp;
            <button id="btnOpenRemoveClassForm">Remover turma</button>
            <br>
        `;

        Lists.addClassList();

        DOM.id("btnOpenSaveClassForm").onclick = () => ClassPages.openSaveClassForm();
        DOM.id("btnOpenEditClassForm").onclick = () => ClassPages.openEditClassForm();
        DOM.id("btnOpenRemoveClassForm").onclick = () => ClassPages.openRemoveClassForm();
    },

    /**
     * Abre a página de outros.
     * Hash padrão: #outros
     * 
     * @returns {void}
     */
    openOthersPage: () => {
        Locks.checkLock();        

        DOM.divs.content.innerHTML = `
            <button id="btnCheckUpdate">Verificar se há atualizações</button>&nbsp;&nbsp;
            <button id="btnMakeBackup">Fazer backup dos dados</button>&nbsp;&nbsp;
            <button id="btnRecoverBackup">Recuperar o backup</button>&nbsp;&nbsp;
            <button id="btnReset">Resetar</button>
        `;

        DOM.id("btnCheckUpdate").onclick = () => Others.checkUpdate();
        DOM.id("btnMakeBackup").onclick = () => Others.makeBackupLocalStorage();
        DOM.id("btnRecoverBackup").onclick = () => Others.recoverBackupLocalStorage();
        DOM.id("btnReset").onclick = () => Others.deleteLocalStorage();
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
            <label for="search">Pesquise pelo nome:</label>&nbsp;
            <input type="text" id="search">
            <ul id="bookList"></ul>
        `;

        const back = DOM.id("back");
        back.onclick = () => {
            DOM.divs.others.innerHTML = "";
            RootPages.openLockScreen();
        }

        const search = DOM.id("search");
        const bookList = DOM.id("bookList");
        Lists.showBookListForStudents();
        Lists.addSearch(search, bookList);
    }
});

export { RootPages }