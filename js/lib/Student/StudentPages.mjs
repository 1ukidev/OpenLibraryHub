import { DOM } from "../DOM.mjs";
import { Lists } from "../Lists.mjs";
import { RootPages } from "../RootPages.mjs";
import { Forms } from "../Forms.mjs";
import { Students } from "./Students.mjs";
import { Classes } from "../Class/Classes.mjs";
import { Others } from "../Others.mjs";

const StudentPages = {
    /**
     * Abre o formulário para adicionar um estudante.
     * 
     * @returns {void}
     */
    openSaveStudentForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="/OpenLibraryHub/src/Team work-bro.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formAddStudent">
                    <input type="text" id="studentName" placeholder="Nome">&nbsp;
                    <select id="studentClass">
                        <option value="" disabled selected>Selecione a turma</option>
                    </select>&nbsp;
                    <button id="btnSubmitAddStudent">Adicionar</button>
                </div>
            </aside>
        `;

        Lists.addStudentList();

        DOM.id("btnBack").onclick = () => RootPages.openStudentPage();
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
    },

    /**
     * Abre o formulário para editar um estudante.
     * 
     * @returns {void}
     */
    openEditStudentForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="/OpenLibraryHub/src/Team work-bro.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formEditStudent">
                    <label for="students">Estudante:</label>&nbsp;
                    <select id="students">
                        <option value="" disabled selected>Selecione o estudante</option>
                    </select>
                    <br><br>
                    <input type="text" id="studentName" placeholder="Nome"><br><br>
                    <select id="studentClass">
                        <option value="" disabled selected>Selecione a turma</option>
                    </select><br><br>
                    <button id="btnSubmitEditStudent">Editar</button>
                </div>
            </aside>
        `;

        Lists.addStudentList();

        const students = Students.getAllStudents();
        const studentsSelect = DOM.id("students");
        students.forEach((student) => {
            const studentObject = JSON.parse(student);
            const option = DOM.element("option");
            option.textContent = `${studentObject.name} - Id: ${studentObject.id}`;
            studentsSelect.appendChild(option);
        });

        DOM.id("students").onchange = () => {
            const studentObject = Students.getStudentById(DOM.id("students").value.split(" - Id: ")[1]);
            DOM.id("studentName").value = studentObject.name;
            DOM.id("studentClass").value = studentObject.schoolClass;
        }

        DOM.id("btnBack").onclick = () => RootPages.openStudentPage();
        DOM.id("btnSubmitEditStudent").onclick = () => Forms.runFormEditStudent();

        Classes.getAllClasses().forEach((schoolClass) => {
            const option = DOM.element("option");
            const schoolClassObject = JSON.parse(schoolClass);
            option.textContent = schoolClassObject.name;
            DOM.id("studentClass").appendChild(option);
        });
    },

    /**
     * Abre o formulário para remover um estudante.
     * 
     * @returns {void}
     */
    openRemoveStudentForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="/OpenLibraryHub/src/Team work-bro.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formRemoveStudent">
                    <label for="studentId">Remover estudante de id:</label>&nbsp;
                    <input type="number" id="studentId">&nbsp;
                    <button id="btnSubmitRemoveStudent">Remover</button>
                </div>
            </aside>
        `;

        Lists.addStudentList();

        DOM.id("btnBack").onclick = () => RootPages.openStudentPage();
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

}

export { StudentPages };