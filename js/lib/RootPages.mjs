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

        DOM.id("lock").style.height = "100vh"

        DOM.divs.lock.innerHTML = `
            <div class="lock-container">
                <img class="lock-icon" src="/OpenLibraryHub/src/Library-rafiki.svg">
                <h1>Bem-vindo ao OpenLibraryHub!</h1>
                <h2>(${version})</h2>

                <div class="lock-form">
                    <h2>Crie uma senha antes de começar:</h2>
                    <input type="password" id="password" placeholder="Senha">&nbsp;
                    <button class="button" id="submit"><span class="material-symbols-outlined">meeting_room</span> Cadastrar</button>
                </div>
            </div>
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

        DOM.id("lock").style.height = "100vh"

        DOM.divs.lock.innerHTML = `
            <div class="lock-container">
                <img class="lock-icon" src="/OpenLibraryHub/src/Library-rafiki.svg">
                <h1>Bem-vindo ao OpenLibraryHub!</h1>
                <h2>(${version})</h2>
                <div class="lock-buttons">
                    <a id="linkOpenAllBooks" class="linkOpenAllBooks"><button class="button">Estudante</button></a>
                    <button class="button" id="bibliotecario">Bibliotecario</button>
                </div>

                <div class="lock-form display-none">
                    <h2>Insira a senha cadastrada para continuar:</h2>
                    <input type="password" id="password" placeholder="Senha">&nbsp;
                    <button id="submit" class="button"><span class="material-symbols-outlined">meeting_room</span>Entrar</button>
                </div>
            </div>
        `;

        const btnBibliotecario = DOM.id("bibliotecario");
        btnBibliotecario.addEventListener("click", () => {
            //DOM.class(".lock-form").classList.toggle("display-none")
            document.querySelector(".lock-form").classList.toggle("display-none")
            document.querySelector(".lock-buttons").classList.toggle("display-none")
        })

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
            <div class="menu-container">
                <ul class="menu">
                    <li><a id="a-1" class="menu-item"><span class="material-symbols-outlined">library_books</span> Status</a></li>
                    <li><a id="a-2" class="menu-item"><span class="material-symbols-outlined">menu_book</span> Livros</a></li>
                    <li><a id="a-3" class="menu-item"><span class="material-symbols-outlined">school</span> Turmas</a></li>
                    <li><a id="a-4" class="menu-item"><span class="material-symbols-outlined">group</span> Estudantes</a></li>
                    <li><a id="a-5" class="menu-item"><span class="material-symbols-outlined">build</span> Outros</a></li>
                    <li><a id="a-6" class="menu-item"><span class="material-symbols-outlined">exit_to_app</span> Sair</a></li>
                </ul>
            </div>
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

        document.querySelectorAll(".menu-item").forEach(e => {
            e.classList.remove("menu_item-select")
        })
        DOM.id("a-1").classList.add("menu_item-select")

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
        mainText2.innerHTML = "Alunos que estão com livros emprestados: <br><br>";
        const lentBooks = [];
        const students = Students.getAllStudents();

        for (let i = 0; i < students.length; i++) {
            const studentObject = JSON.parse(students[i]);
            const size = Object.keys(studentObject.lentBook).length;

            if (studentObject.lentBook !== null) {
                for (let j = 0; j < size; j++) {
                    const bookId = studentObject.lentBook[j].id;
                    const lentDate = studentObject.lentBook[j].lentDate;
                    const bookObject = Books.getBookById(bookId);
                    lentBooks.push({nome:studentObject.name, turma:studentObject.schoolClass, livro:bookObject.name, dataEntrega:lentDate})
                }
            }
        }

        if (lentBooks.length > 0) {
            const table = DOM.element("table");
            const thead = DOM.element("thead");
            const tbody = DOM.element("tbody");

            let tr = DOM.element("tr");

            let nome = DOM.element("th");
            nome.innerHTML = "Nome";
            let turma = DOM.element("th");
            turma.innerHTML = "Turma";
            let livro = DOM.element("th");
            livro.innerHTML = "Livro";
            let dataEntrega = DOM.element("th");
            dataEntrega.innerHTML = "Data de Entrega";

            tr.appendChild(nome);
            tr.appendChild(turma);
            tr.appendChild(livro);
            tr.appendChild(dataEntrega);

            thead.appendChild(tr)

            lentBooks.forEach(book => {
                let tr = DOM.element("tr");

                tr.innerHTML = `
                    <td>${book.nome}</td>
                    <td>${book.turma}</td>
                    <td>${book.livro}</td>
                    <td>${book.dataEntrega}</td>
                `
                tbody.appendChild(tr)
            })

            table.appendChild(thead);
            table.appendChild(tbody);

            DOM.id("content").appendChild(table);
        } else {
            mainText2.innerHTML += "Nenhum";
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

        document.querySelectorAll(".menu-item").forEach(e => {
            e.classList.remove("menu_item-select")
        })
        DOM.id("a-2").classList.add("menu_item-select")

        DOM.divs.content.innerHTML = `
            <div class="buttons-container">
                <button class="button" id="btnOpenSaveBookForm">Adicionar livro</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenLendBookForm">Emprestar um livro</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenReturnBookForm">Devolver livro</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenEditBookForm">Editar livro</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenRemoveBookForm">Remover livro</button>
            </div>
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

        document.querySelectorAll(".menu-item").forEach(e => {
            e.classList.remove("menu_item-select")
        })
        DOM.id("a-4").classList.add("menu_item-select")

        DOM.divs.content.innerHTML = `
            <div class="buttons-container">
                <button class="button" id="btnOpenSaveStudentForm">Adicionar estudante</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenEditStudentForm">Editar estudante</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenRemoveStudentForm">Remover estudante</button>
            </div>
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

        document.querySelectorAll(".menu-item").forEach(e => {
            e.classList.remove("menu_item-select")
        })
        DOM.id("a-3").classList.add("menu_item-select")

        DOM.divs.content.innerHTML = `
            <div class="buttons-container">
                <button class="button" id="btnOpenSaveClassForm">Adicionar turma</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenEditClassForm">Editar turma</button>&nbsp;&nbsp;
                <button class="button" id="btnOpenRemoveClassForm">Remover turma</button>
            </div>
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

        document.querySelectorAll(".menu-item").forEach(e => {
            e.classList.remove("menu_item-select")
        })
        DOM.id("a-5").classList.add("menu_item-select")

        DOM.divs.content.innerHTML = `
            <div class="buttons-container">
                <button class="button" id="btnCheckUpdate">Verificar se há atualizações</button>&nbsp;&nbsp;
                <button class="button" id="btnMakeBackup">Fazer backup dos dados</button>&nbsp;&nbsp;
                <button class="button" id="btnRecoverBackup">Recuperar o backup</button>&nbsp;&nbsp;
                <button class="button" id="btnReset">Resetar</button>
            </div>
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
            <section>
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>
                <h1>Lista de livros:</h1>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="search">
                <div class="table-container"></div>
            </section>
        `;

        const back = DOM.id("btnBack");
        back.onclick = () => {
            DOM.divs.others.innerHTML = "";
            RootPages.openLockScreen(); 
        }

        Lists.showBookListForStudents();
    }
});

export { RootPages };