import { DOM } from "../DOM.mjs";
import { Lists } from "../Lists.mjs";
import { RootPages } from "../RootPages.mjs";
import { Forms } from "../Forms.mjs";
import { Books } from "./Books.mjs";
import { Others } from "../Others.mjs";
import { Students } from "../Student/Students.mjs";

const BookPages = {
    /**
     * Abre o formulário para adicionar um livro.
     * 
     * @returns {void}
     */
    openSaveBookForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="${Others.checkURL()}/Reading glasses-bro.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formAddBook">
                    <input type="text" id="bookName" placeholder="Nome">&nbsp;
                    <input type="text" id="bookAuthor" placeholder="Autor">&nbsp;
                    <input type="text" id="bookSection" placeholder="Seção">&nbsp;
                    <input type="number" id="bookPages" placeholder="Quantidade de páginas">&nbsp;
                    <input type="number" id="bookYear" placeholder="Ano">&nbsp;
                    <input type="number" id="bookStock" placeholder="Quantidade em estoque">&nbsp;
                    <button id="btnSubmitAddBook">Adicionar</button>
                </div>
            </aside>
        `;

        Lists.addBookList();

        DOM.id("btnBack").onclick = () => RootPages.openBookPage();
        DOM.id("btnSubmitAddBook").onclick = () => Forms.runFormAddBook();

        const bookName = DOM.id("bookName");
        const bookAuthor = DOM.id("bookAuthor");
        const bookSection = DOM.id("bookSection");
        const bookPages = DOM.id("bookPages");
        const bookYear = DOM.id("bookYear");
        const bookStock = DOM.id("bookStock");
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
                bookSection.focus();
            }
        });
        bookSection.addEventListener("keypress", (event) => {
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
                bookStock.focus();
            } else if (!Others.numberMask(event)) {
                event.preventDefault();
            }
        });
        bookStock.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                btnSubmitAddBook.click();
                bookName.focus();
            } else if (!Others.numberMask(event)) {
                event.preventDefault();
            }
        });
    },

    /**
     * Abre o formulário para emprestar um livro.
     * 
     * @returns {void}
     */
    openLendBookForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="${Others.checkURL()}/Notebook-bro.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formLendBook">
                    <label for="bookId">Emprestar livro de id:</label>&nbsp;
                    <input type="number" id="bookId">&nbsp;
                    <label for="studentId">para o estudante de id:</label>&nbsp;
                    <input type="number" id="studentId">&nbsp;
                    <label for="lentDate">Data de entrega:</label>&nbsp;
                    <input type="date" id="lentDate">&nbsp;
                    <button id="btnSubmitLendBook">Emprestar</button>
                </div>
            </aside>
        `;

        Lists.addBookList();
        Lists.addStudentList();

        DOM.id("btnBack").onclick = () => RootPages.openBookPage();
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
        
        document.querySelectorAll(".selecionarLivro").forEach(button => {
            button.onclick = () => {
                const bookObject = Books.getBookById(button.parentNode.parentNode.children[0].textContent);
                bookId.value = bookObject.id
            }
        })
        
        document.querySelectorAll(".selecionarEstudante").forEach(button => {
            button.onclick = () => {
                const studentObject = Students.getStudentById(button.parentNode.parentNode.children[0].textContent);
                studentId.value = studentObject.id
            }
        })
    },

    /**
     * Abre o formulário para devolver um livro.
     * 
     * @returns {void}
     */
    openReturnBookForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="${Others.checkURL()}/To do list-rafiki.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formReturnBook">
                    <label for="bookId">Devolver livro de id:</label>&nbsp;
                    <input type="number" id="bookId">&nbsp;
                    <label for="studentId">Do aluno de id:</label>&nbsp;
                    <input type="number" id="studentId">&nbsp;
                    <button id="btnSubmitReturnBook">Devolver</button>
                </div>
            </aside>
        `;

        Lists.addBookList();
        Lists.addStudentList();

        DOM.id("btnBack").onclick = () => RootPages.openBookPage();
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
        
        document.querySelectorAll(".selecionarLivro").forEach(button => {
            button.onclick = () => {
                const bookObject = Books.getBookById(button.parentNode.parentNode.children[0].textContent);
                bookId.value = bookObject.id
            }
        })
        
        document.querySelectorAll(".selecionarEstudante").forEach(button => {
            button.onclick = () => {
                const studentObject = Students.getStudentById(button.parentNode.parentNode.children[0].textContent);
                studentId.value = studentObject.id
            }
        })
    },

    /**
     * Abre o formulário para editar um livro.
     * 
     * @returns {void}
     */
    openEditBookForm: () => {
        Lists.addBookList();
        DOM.divs.content.innerHTML = `
        <aside>
            <img src="${Others.checkURL()}/Hand holding pen-amico.svg" class="form-icon">
            <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

            <div class="form" id="formEditBook">
                <input type="text" id="bookName" placeholder="Nome">&nbsp;
                <input type="text" id="bookAuthor" placeholder="Autor">&nbsp;
                <input type="text" id="bookSection" placeholder="Seção">&nbsp;
                <input type="number" id="bookPages" placeholder="Quantidade de páginas">&nbsp;
                <input type="number" id="bookStock" placeholder="Quantidade em estoque">&nbsp;
                <input type="number" id="bookYear" placeholder="Ano">&nbsp;
                <br><br>
                <button id="btnSubmitEditBook">Editar</button>
            </div>
        </aside>
        `;

        Lists.addBookList();

        document.querySelectorAll(".selecionarLivro").forEach(button => {
            button.onclick = () => {
                const bookObject = Books.getBookById(button.parentNode.parentNode.children[0].textContent);
                DOM.id("bookName").value = bookObject.name;
                DOM.id("bookAuthor").value = bookObject.author;
                DOM.id("bookSection").value = bookObject.section;
                DOM.id("bookPages").value = bookObject.pages;
                DOM.id("bookYear").value = bookObject.year;
                DOM.id("bookStock").value = bookObject.stock;
            }
        })

        DOM.id("btnBack").onclick = () => RootPages.openBookPage();
        DOM.id("btnSubmitEditBook").onclick = () => Forms.runFormEditBook();
    },

    /**
     * Abre o formulário para remover um livro.
     * 
     * @returns {void}
     */
    openRemoveBookForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="${Others.checkURL()}/Team work-bro.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>
                <br><br>

                <div class="form" id="formRemoveBook">
                    <label for="bookId">Remover livro de id:</label>&nbsp;
                    <input type="number" id="bookId">&nbsp;
                    <button id="btnSubmitRemoveBook">Remover</button>
                </div>
            </aside>
        `;

        Lists.addBookList();

        DOM.id("btnBack").onclick = () => RootPages.openBookPage();
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

        document.querySelectorAll(".selecionarLivro").forEach(button => {
            button.onclick = () => {
                const bookObject = Books.getBookById(button.parentNode.parentNode.children[0].textContent);
                bookId.value = bookObject.id;
            }
        });
    }
}

export { BookPages };