import { DOM } from "./DOM.mjs";
import { Locks } from "./Locks.mjs";
import { Books } from "./Books.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "./Classes.mjs";
import { Lists } from "./Lists.mjs";
import { Others } from "./Others.mjs";
import { Forms } from "./Forms.mjs";
import { version } from "./Constants.mjs";

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
            case "#outros":
                Pages.openOthersPage();
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

        submit.onclick = async () => await Locks.createLock();
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
                <li><a id="a-5" class="a-5">&nbsp;🔧 Outros&nbsp;</a></li>
                <li><a id="a-6" class="a-6">&nbsp;🔒 Sair&nbsp;</a></li>
            </ul>
            <br>
        `;

        DOM.id("a-1").onclick = () => Pages.changePage("");
        DOM.id("a-2").onclick = () => Pages.changePage("#livros");
        DOM.id("a-3").onclick = () => Pages.changePage("#turmas");
        DOM.id("a-4").onclick = () => Pages.changePage("#estudantes");
        DOM.id("a-5").onclick = () => Pages.changePage("#outros");
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
            <button id="btnOpenRemoveBookForm">Remover livro</button>
            <br>
        `;

        /**
         * Adiciona a lista de livros.
         * 
         * @returns {void}
         */
        const addBookList = () => {
            DOM.divs.content.innerHTML += `
                <h2>Lista de livros:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="search">
                <ul id="bookList"></ul>
            `;

            const search = DOM.id("search");
            const bookList = DOM.id("bookList");
            Lists.addSearch(search, bookList);
            Lists.showBookList();
        }

        /**
         * Adiciona a lista de estudantes.
         * 
         * @returns {void}
         */
        const addStudentList = () => {
            DOM.divs.content.innerHTML += `
                <h2>Lista de estudantes:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="search2">
                <ul id="studentList"></ul>
            `;
            const studentList = DOM.id("studentList");
            const search2 = DOM.id("search2");
            Lists.addSearch(search2, studentList);
            Lists.showStudentList();
        }

        /**
         * Abre o formulário para adicionar um livro.
         * 
         * @returns {void}
         */
        const openSaveBookForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formAddBook">
                    <input type="text" id="bookName" placeholder="Nome">&nbsp;
                    <input type="text" id="bookAuthor" placeholder="Autor">&nbsp;
                    <input type="number" id="bookPages" placeholder="Quantidade de páginas">&nbsp;
                    <input type="number" id="bookYear" placeholder="Ano">&nbsp;
                    <button id="btnSubmitAddBook">Adicionar</button>
                </div>
            `;

            addBookList();

            DOM.id("btnBack").onclick = () => Pages.openBookPage();
            DOM.id("btnSubmitAddBook").onclick = () => Forms.runFormAddBook();

            const bookName = DOM.id("bookName");
            const bookAuthor = DOM.id("bookAuthor");
            const bookPages = DOM.id("bookPages");
            const bookYear = DOM.id("bookYear");
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
                    btnSubmitAddBook.click();
                    bookName.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
        }

        /**
         * Abre o formulário para emprestar um livro.
         * 
         * @returns {void}
         */
        const openLendBookForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formLendBook">
                    <label for="bookId">Emprestar livro de id:</label>&nbsp;
                    <input type="number" id="bookId">&nbsp;
                    <label for="studentId">para o estudante de id:</label>&nbsp;
                    <input type="number" id="studentId">&nbsp;
                    <label for="lentDate">Data de entrega:</label>&nbsp;
                    <input type="date" id="lentDate">&nbsp;
                    <button id="btnSubmitLendBook">Emprestar</button>
                </div>
            `;

            addBookList();
            addStudentList();

            DOM.id("btnBack").onclick = () => Pages.openBookPage();
            DOM.id("btnSubmitLendBook").onclick = () => Forms.runFormLendBook();

            const bookId = DOM.id("bookId");
            const studentId = DOM.id("studentId");
            const lentDate = DOM.id("lentDate");
            bookId.focus();

            bookId.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    studentId.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
            studentId.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    lentDate.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
            lentDate.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitLendBook.click();
                    bookId.focus();
                }
            });
        }

        /**
         * Abre o formulário para devolver um livro.
         * 
         * @returns {void}
         */
        const openReturnBookForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formReturnBook">
                    <label for="bookId">Devolver livro de id:</label>&nbsp;
                    <input type="number" id="bookId">&nbsp;
                    <button id="btnSubmitReturnBook">Devolver</button>
                </div>
            `;

            addBookList();
            addStudentList();

            DOM.id("btnBack").onclick = () => Pages.openBookPage();
            DOM.id("btnSubmitReturnBook").onclick = () => Forms.runFormReturnBook();

            const bookId = DOM.id("bookId");
            bookId.focus();

            bookId.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitReturnBook.click();
                    bookId.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
        }

        /**
         * Abre o formulário para remover um livro.
         * 
         * @returns {void}
         */
        const openRemoveBookForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formRemoveBook">
                    <label for="bookId">Remover livro de id:</label>&nbsp;
                    <input type="number" id="bookId">&nbsp;
                    <button id="btnSubmitRemoveBook">Remover</button>
                </div>
            `;

            addBookList();

            DOM.id("btnBack").onclick = () => Pages.openBookPage();
            DOM.id("btnSubmitRemoveBook").onclick = () => Forms.runFormRemoveBook();

            const bookId = DOM.id("bookId");
            bookId.focus();

            bookId.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitRemoveBook.click();
                    bookId.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
        }

        addBookList();

        DOM.id("btnOpenSaveBookForm").onclick = () => openSaveBookForm();
        DOM.id("btnOpenLendBookForm").onclick = () => openLendBookForm();
        DOM.id("btnOpenReturnBookForm").onclick = () => openReturnBookForm();
        DOM.id("btnOpenRemoveBookForm").onclick = () => openRemoveBookForm();
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
            <button id="btnOpenRemoveStudentForm">Remover estudante</button>&nbsp;&nbsp;
            <br>
        `;

        /**
         * Adiciona a lista de estudantes.
         * 
         * @returns {void}
         */
        const addStudentList = () => {
            DOM.divs.content.innerHTML += `
                <h2>Lista de estudantes:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="search">
                <ul id="studentList"></ul>
            `;

            const search = DOM.id("search");
            const studentList = DOM.id("studentList");
            Lists.addSearch(search, studentList);
            Lists.showStudentList();
        }

        /**
         * Abre o formulário para adicionar um estudante.
         * 
         * @returns {void}
         */
        const openSaveStudentForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formAddStudent">
                    <input type="text" id="studentName" placeholder="Nome">&nbsp;
                    <select id="studentClass">
                        <option value="" disabled selected>Selecione a turma</option>
                    </select>&nbsp;
                    <button id="btnSubmitAddStudent">Adicionar</button>
                </div>
            `;

            addStudentList();

            DOM.id("btnBack").onclick = () => Pages.openStudentPage();
            DOM.id("btnSubmitAddStudent").onclick = () => Forms.runFormAddStudent();

            const studentName = DOM.id("studentName");
            const studentClass = DOM.id("studentClass");
            studentName.focus();

            studentName.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    studentClass.focus();
                }
            });
            studentClass.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitAddStudent.click();
                    studentName.focus();
                }
            });

            Classes.getAllClasses().forEach((schoolClass) => {
                const option = DOM.element("option");
                const schoolClassObject = JSON.parse(schoolClass);
                option.textContent = schoolClassObject.name;
                DOM.id("studentClass").appendChild(option);
            });
        }

        /**
         * Abre o formulário para remover um estudante.
         * 
         * @returns {void}
         */
        const openRemoveStudentForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formRemoveStudent">
                    <label for="studentId">Remover estudante de id:</label>&nbsp;
                    <input type="number" id="studentId">&nbsp;
                    <button id="btnSubmitRemoveStudent">Remover</button>
                </div>
            `;

            addStudentList();

            DOM.id("btnBack").onclick = () => Pages.openStudentPage();
            DOM.id("btnSubmitRemoveStudent").onclick = () => Forms.runFormRemoveStudent();

            const studentId = DOM.id("studentId");
            studentId.focus();

            studentId.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitRemoveStudent.click();
                    studentId.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
        }

        addStudentList();

        DOM.id("btnOpenSaveStudentForm").onclick = () => openSaveStudentForm();
        DOM.id("btnOpenRemoveStudentForm").onclick = () => openRemoveStudentForm();
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
            <button id="btnOpenRemoveClassForm">Remover turma</button>&nbsp;&nbsp;
            <br>
        `;

        /**
         * Adiciona a lista de turmas.
         * 
         * @returns {void}
         */
        const addClassList = () => {
            DOM.divs.content.innerHTML += `
                <h2>Lista de turmas:</h2>
                <label for="search">Pesquise pelo nome:</label>&nbsp;
                <input type="text" id="search">
                <ul id="classList"></ul>
            `;

            const search = DOM.id("search");
            const classList = DOM.id("classList");
            Lists.addSearch(search, classList);
            Lists.showClassList();
        }

        /**
         * Abre o formulário para adicionar uma turma.
         * 
         * @returns {void}
         */
        const openSaveClassForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formAddClass">
                    <input type="text" id="className" placeholder="Nome">&nbsp;
                    <button id="btnSubmitAddClass">Adicionar</button>
                </div>
            `;

            addClassList();

            DOM.id("btnBack").onclick = () => Pages.openClassPage();
            DOM.id("btnSubmitAddClass").onclick = () => Forms.runFormAddClass();

            const className = DOM.id("className");
            className.focus();

            className.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitAddClass.click();
                    className.focus();
                }
            });
        }

        /**
         * Abre o formulário para remover uma turma.
         * 
         * @returns {void}
         */
        const openRemoveClassForm = () => {
            DOM.divs.content.innerHTML = `
                <button id="btnBack">◀️ Voltar</button>
                <br><br>

                <div id="formRemoveClass">
                    <label for="classId">Remover turma de id:</label>
                    <input type="number" id="classId">
                    <button id="btnSubmitRemoveClass">Remover</button>
                </div>
            `;

            addClassList();

            DOM.id("btnBack").onclick = () => Pages.openClassPage();
            DOM.id("btnSubmitRemoveClass").onclick = () => Forms.runFormRemoveClass();

            const classId = DOM.id("classId");
            classId.focus();

            classId.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnSubmitRemoveClass.click();
                    classId.focus();
                } else if (!Others.numberMask(event)) {
                    event.preventDefault();
                }
            });
        }

        addClassList();

        DOM.id("btnOpenSaveClassForm").onclick = () => openSaveClassForm();
        DOM.id("btnOpenRemoveClassForm").onclick = () => openRemoveClassForm();
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
            <button id="btnResetAll">Resetar tudo</button>&nbsp;&nbsp;
            <button id="btnMakeBackup">Fazer backup dos dados</button>&nbsp;&nbsp;
            <button id="btnRecoverBackup">Recuperar o backup</button>&nbsp;&nbsp;
            <button id="btnCheckUpdate">Verificar se há atualizações</button>
        `;

        DOM.id("btnResetAll").onclick = () => Others.deleteLocalStorage();
        DOM.id("btnMakeBackup").onclick = () => Others.makeBackupLocalStorage();
        DOM.id("btnRecoverBackup").onclick = () => Others.recoverBackupLocalStorage();
        DOM.id("btnCheckUpdate").onclick = () => Others.checkUpdate();
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
            Pages.openLockScreen();
        }

        const search = DOM.id("search");
        const bookList = DOM.id("bookList");
        Lists.showBookListForStudents();
        Lists.addSearch(search, bookList);
    }
});

export { Pages };