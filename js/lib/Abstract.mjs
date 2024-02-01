/**
 * Representa um bloqueio.
 * 
 * @constructor
 * @param {String} password - Senha do bloqueio.
 * @param {String} status - Status do bloqueio.
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
 * @param {Number} id - Id do livro.
 * @param {String} name - Nome do livro.
 * @param {String} author - Autor do livro.
 * @param {Number} pages - Quantidade de páginas do livro.
 * @param {Number} year - Ano do livro.
 * @param {Number} stock - Quantidade de livros em estoque.
 * @param {Boolean} lent - Se o livro está emprestado. Padrão: false
 * @param {Array} lentTo - Estudantes que estão com o livro emprestado. Padrão: []
 */
const Book = class {
    constructor(id, name, author, section, pages, year, stock) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.section = section;
        this.pages = pages;
        this.year = year;
        this.stock = stock;
        this.lent = false;
        this.lentTo = [];
    }
}

/**
 * Representa um estudante.
 * 
 * @constructor
 * @param {Number} id - Id do estudante.
 * @param {String} name - Nome do estudante.
 * @param {String} schoolClass - Turma do estudante.
 * @param {Object} lentBook - Livro(s) que o estudante pediu emprestado. Padrão: {}
 */ 
const Student = class {
    constructor(id, name, schoolClass) {
        this.id = id;
        this.name = name;
        this.schoolClass = schoolClass;
        this.lentBook = {};
    }
}

/**
 * Representa uma turma.
 * 
 * @constructor
 * @param {Number} id - Id da turma.
 * @param {String} name - Nome da turma.
 */
const Class = class {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

export { Lock, Book, Student, Class };