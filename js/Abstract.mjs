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

export { Lock, Book, Student, Class };