// Global variables ---------------------------------------------
const divHeader = document.getElementById("header");
const divContent = document.getElementById("content");
const divFooter = document.getElementById("footer");
const version = "0.2.5";

// Pages --------------------------------------------------------
const Pages = {
    changePage: (hash) => {
        location.hash = hash;
    },

    route: () => {
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

    openMainHeader: () => {
        divHeader.innerHTML = `
            <ul>
                <li><a onclick="Pages.changePage('#')" class="a-1">&nbsp;📖 Status&nbsp;</a></li>
                <li><a onclick="Pages.changePage('livros')" class="a-2">&nbsp;📚 Livros&nbsp;</a></li>
                <li><a onclick="Pages.changePage('turmas')" class="a-3">&nbsp;🏫 Turmas&nbsp;</a></li>
                <li><a onclick="Pages.changePage('estudantes')" class="a-4">&nbsp;🧑 Estudantes&nbsp;</a></li>
            </ul>
            <br>
        `;
    },

    openMainContent: () => {
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

    openBookPage: () => {
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
            <button onclick="Others.checkUpdate()">Verificar se há atualizações</button>

            <h2>Lista de livros:</h2>
            <ul id="bookList"></ul>
        `;

        Lists.showBookList();
    },

    openStudentPage: () => {
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
            <button onclick="Others.checkUpdate()">Verificar se há atualizações</button>

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

    openClassPage: () => {
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
            <button onclick="Others.checkUpdate()">Verificar se há atualizações</button>

            <h2>Lista de turmas:</h2>
            <ul id="classList"></ul>
            <br>
        `;

        Lists.showClassList();
    }
}

// Abstract classes ---------------------------------------------
class Book {
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

class Student {
    constructor(id, name, schoolClass) {
        this.id = id;
        this.name = name;
        this.schoolClass = schoolClass;
        this.lentBook = null;
    }
}

class Class {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

// localStorage -------------------------------------------------
const Books = {
    addBook: (id, name, author, pages, year) => {
        console.log(`localStorage: salvando livro "${name}"...`);
        const book = new Book(id, name, author, pages, year);
        book.type = "Book";
        localStorage.setItem(localStorage.length++, JSON.stringify(book));
        console.log(`localStorage: livro "${name}" salvo com sucesso!`);
    },

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

    removeBookById: (id) => {
        console.log(`localStorage: removendo livro com id "${id}"...`);
        const book = Books.getBookById(id);
        if (book) {
            if (book.lentTo != null || book.lentTo != undefined) {
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
}

const Students = {
    addStudent: (id, name, schoolClass) => {
        console.log(`localStorage: salvando estudante "${name}"...`);
        const student = new Student(id, name, schoolClass);
        student.type = "Student";
        localStorage.setItem(localStorage.length++, JSON.stringify(student));
        console.log(`localStorage: estudante "${name}" salvo com sucesso!`);
    },

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

    removeStudentById: (id) => {
        console.log(`localStorage: removendo estudante com id "${id}"...`);
        const student = Students.getStudentById(id);
        if (student) {
            if (student.lentBook != null || student.lentBook != undefined) {
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
}

const Classes = {
    addClass: (id, name) => {
        console.log(`localStorage: salvando turma "${name}""...`);
        const schoolClass = new Class(id, name);
        schoolClass.type = "Class";
        localStorage.setItem(localStorage.length++, JSON.stringify(schoolClass));
        console.log("localStorage: turma '" + name + "' salva com sucesso!");
    },

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
}

// Forms --------------------------------------------------------
const Forms = {
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
            return false;
        } else {
            alert("Por favor, insira todos os dados do livro.");
            return false;
        }
    },

    runForm2: () => {
        const bookName = document.getElementById("bookId");

        if (bookName.value) {
            if (Books.getBookById(bookName.value)) {
                alert(`O livro com id "${bookName.value}" está cadastrado.`);
            } else {
                alert(`O livro com id "${bookName.value}" não está cadastrado.`);
            }
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    runForm3: () => {
        const studentName = document.getElementById("studentName");
        const studentClass = document.getElementById("studentClass");

        if (studentName.value) {
            Students.addStudent(localStorage.length++, studentName.value, studentClass.value);
            studentName.value = "";
            Lists.showStudentList();
            return false;
        } else {
            alert("Por favor, insira o nome do estudante.");
            return false;
        }
    },

    runForm4: () => {
        const studentId = document.getElementById("studentId");

        if (studentId.value) {
            if (Students.getStudentById(studentId.value)) {
                alert(`O estudante com id "${studentId.value}" está cadastrado.`);
            } else {
                alert(`O estudante com id "${studentId.value}" não está cadastrado.`);
            }
        } else {
            alert("Por favor, insira o id do estudante.");
            return false;
        }
    },

    runForm5: () => {
        const className = document.getElementById("className");

        if (className.value) {
            Classes.addClass(localStorage.length++, className.value);
            className.value = "";
            Lists.showClassList();
            return false;
        } else {
            alert("Por favor, insira o nome da turma.");
            return false;
        }
    },

    runForm6: () => {
        const classId = document.getElementById("classId");

        if (classId.value) {
            if (Classes.getClassById(classId.value)) {
                alert(`A turma com id "${classId.value}" está cadastrada.`);
            } else {
                alert(`A turma com id "${classId.value}" não está cadastrada.`);
            }
        } else {
            alert("Por favor, insira o id da turma.");
            return false;
        }
    },

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
            } else {
                alert("O livro ou o estudante não está cadastrado.");
                return false;
            }
        } else {
            alert("Por favor, insira todos os dados.");
            return false;
        }
    },

    runForm8: () => {
        const bookId = document.getElementById("bookId3");

        if (bookId.value) {
            const book = Books.getBookById(bookId.value);
            if (book) {
                if (book.lent) {
                    alert(`O livro com id "${bookId.value}" está emprestado para o estudante com id "${book.lentTo}".`);
                } else {
                    alert(`O livro com id "${bookId.value}" não está emprestado.`);
                }
            } else {
                alert(`O livro com id "${bookId.value}" não está cadastrado.`);
            }
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

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
                } else {
                    alert(`O livro com id "${bookId.value}" não está emprestado.`);
                }
            } else {
                alert(`O livro com id "${bookId.value}" não está cadastrado.`);
            }
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    runForm10: () => {
        const bookId = document.getElementById("bookId5");

        if (bookId.value) {
            Books.removeBookById(bookId.value);
        } else {
            alert("Por favor, insira o id do livro.");
            return false;
        }
    },

    runForm11: () => {
        const studentId = document.getElementById("studentId2");

        if (studentId.value) {
            Students.removeStudentById(studentId.value);
        } else {
            alert("Por favor, insira o id do estudante.");
            return false;
        }
    },

    runForm12: () => {
        const classId = document.getElementById("classId2");

        if (classId.value) {
            Classes.removeClassById(classId.value);
        } else {
            alert("Por favor, insira o id da turma.");
            return false;
        }
    }
}

const Lists = {
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
}

// Others -------------------------------------------------------
const Others = {
    checkUpdate: () => {
        console.log("Verificando atualizações...");

        fetch("https://raw.githubusercontent.com/1ukidev/OpenLibraryHub/main/VERSION")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                console.log(`Versão atual: ${version}`);
                console.log(`Retorno: ${data}`);
    
                if (data.trim() == version) {
                    alert("Você está usando a versão mais recente!");
                    console.log("Você está usando a versão mais recente!");
                } else {
                    alert("Há uma atualização disponível! Acesse 'https://github.com/1ukidev/OpenLibraryHub' para baixar a nova versão.");
                    console.log("Há uma atualização disponível! Acesse 'https://github.com/1ukidev/OpenLibraryHub' para baixar a nova versão.");
                }
            })
            .catch((error) => {
                return console.error(`Erro ao verificar atualizações: ${error}`);
            });
    },

    makeBackupLocalStorage: () => {
        console.log("Fazendo backup...");
        let values;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            values += localStorage.getItem(key);
        }
        if (values == undefined) {
            alert("Erro ao fazer backup: nenhum dado encontrado.");
            return console.error("Erro ao fazer backup: nenhum dado encontrado.");
        }
        const valuesBase64 = btoa(values.replace("undefined", ""));
    
        const link = document.createElement("a");
        link.href = `data:text/plain;base64,${valuesBase64}`;
        link.download = "OpenLibraryHubBackup.txt";
        link.click();
    
        console.log("Backup feito com sucesso!");
    },

    deleteLocalStorage: () => {
        console.log("localStorage: apagando todos os dados...");
        localStorage.clear();
        Lists.showBookList();
        Lists.showStudentList();
        Lists.showClassList();
        console.log("localStorage: os dados foram apagados com sucesso!");
    },

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
}

// Initialization -----------------------------------------------
document.body.onload = () => {
    console.log(`Inicializando OpenLibraryHub (${version})...`);
    Pages.openMainHeader();
    Pages.route();
    console.log("Inicializado com sucesso!");
}