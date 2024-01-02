import { Class } from "./Abstract.mjs";
import { Lists } from "./Lists.mjs";

export const Classes = Object.freeze({
    /**
     * Adiciona uma turma ao localStorage.
     * 
     * @param {number} id - Id da turma.
     * @param {string} name - Nome da turma.
     */
    addClass: (id, name) => {
        console.log(`localStorage: salvando turma "${name}"...`);
        const schoolClass = new Class(id, name);
        schoolClass.type = "Class";
        localStorage.setItem(id, JSON.stringify(schoolClass));
        console.log(`localStorage: turma "${name}" salva com sucesso!`);
    },

    /**
     * Busca todas as turmas.
     * 
     * @returns {Array} - Array com todas as turmas.
     */
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

    /**
     * Busca uma turma pelo o seu id.
     * 
     * @param {number} id - Id da turma.
     * @returns {Object} - Objeto da turma.
     * @returns {boolean} - Retorna false se a turma não foi encontrada.
     */
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

    /**
     * Remove uma turma pelo o seu id.
     * 
     * @param {number} id - Id da turma.
     * @returns {boolean} - Retorna true se a turma foi removida com sucesso.
     * @returns {boolean} - Retorna false se a turma não foi encontrada.
     */
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
});