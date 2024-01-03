import { Student } from "./Abstract.mjs";
import { Books } from "./Books.mjs";
import { Lists } from "./Lists.mjs";

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

export { Students };