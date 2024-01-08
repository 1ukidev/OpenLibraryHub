import { Student } from "../Abstract.mjs";
import { Books } from "../Book/Books.mjs";
import { Lists } from "../Lists.mjs";

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
        localStorage.setItem(id, JSON.stringify(student));
        console.log(`localStorage: estudante "${name}" salvo com sucesso!`);
    },

    /**
     * Busca todos os estudantes.
     * 
     * @returns {Array} Array com todos os estudantes.
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
     * @returns {Object} Objeto do estudante.
     * @returns {boolean} Retorna false se o estudante não foi encontrado.
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
     * @returns {boolean} Retorna true se o estudante foi removido com sucesso.
     * @returns {boolean} Retorna false se o estudante não foi encontrado.
     */
    removeStudentById: (id) => {
        console.log(`localStorage: removendo estudante com id "${id}"...`);
        const student = Students.getStudentById(id);

        if (student) {
            const lentBookSize = Object.keys(student.lentBook).length;
            if (lentBookSize > 0) {
                const lentBook = student.lentBook;
                for (let i = 0; i < lentBookSize; i++) {
                    const book = Books.getBookById(lentBook[i].id);
                    Books.returnBook(book, student);
                }
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
    },

    /**
     * Atualiza um estudante no localStorage.
     *  
     * @param {Object} student - Objeto do estudante.
     */
    updateStudent: (student) => {
        console.log(`localStorage: atualizando estudante "${student.name}"...`);
        localStorage.setItem(student.id, JSON.stringify(student));
        console.log(`localStorage: estudante "${student.name}" atualizado com sucesso!`);
    }
});

export { Students };