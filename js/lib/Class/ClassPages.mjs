import { DOM } from "../DOM.mjs";
import { Lists } from "../Lists.mjs";
import { RootPages } from "../RootPages.mjs";
import { Forms } from "../Forms.mjs";
import { Classes } from "./Classes.mjs";
import { Others } from "../Others.mjs";

const ClassPages = Object.freeze({
    /**
     * Abre o formulário para adicionar uma turma.
     * 
     * @returns {void}
     */
    openSaveClassForm: () => {
        DOM.divs.content.innerHTML = `
        <aside>
            <img src="${Others.checkURL()}/college class-pana.svg" class="form-icon">
            <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

            <div class="form" id="formAddClass">
                <input type="text" id="className" placeholder="Nome">&nbsp;
                <button id="btnSubmitAddClass">Adicionar</button>
            </div>
        </aside>
        `;

        Lists.addClassList();

        DOM.id("btnBack").onclick = () => RootPages.openClassPage();
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
    },

    /**
     * Abre o formulário para editar uma turma.
     * 
     * @returns {void}
     */
    openEditClassForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="${Others.checkURL()}/Lesson-amico.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formEditClass">
                    <label for="classes">Turma:</label>&nbsp;
                    <select id="classes">
                        <option value="" disabled selected>Selecione a turma</option>
                    </select>
                    <br><br>
                    <input type="text" id="className" placeholder="Nome"><br><br>
                    <button id="btnSubmitEditClass">Editar</button>
                </div>
            </aside>
        `;

        Lists.addClassList();

        const classes = Classes.getAllClasses();
        const classesSelect = DOM.id("classes");
        classes.forEach((schoolClass) => {
            const schoolClassObject = JSON.parse(schoolClass);
            const option = DOM.element("option");
            option.textContent = `${schoolClassObject.name} - Id: ${schoolClassObject.id}`;
            classesSelect.appendChild(option);
        });

        DOM.id("classes").onchange = () => {
            const schoolClassObject = Classes.getClassById(DOM.id("classes").value.split(" - Id: ")[1]);
            DOM.id("className").value = schoolClassObject.name;
        }

        DOM.id("btnBack").onclick = () => RootPages.openClassPage();
        DOM.id("btnSubmitEditClass").onclick = () => Forms.runFormEditClass();
    },

    /**
     * Abre o formulário para remover uma turma.
     * 
     * @returns {void}
     */
    openRemoveClassForm: () => {
        DOM.divs.content.innerHTML = `
            <aside>
                <img src="${Others.checkURL()}/Lesson-cuate.svg" class="form-icon">
                <button id="btnBack"><span class="material-symbols-outlined">arrow_back</span> Voltar</button>

                <div class="form" id="formRemoveClass">
                    <label for="classId">Remover turma de id:</label>&nbsp;
                    <input type="number" id="classId">&nbsp;
                    <button id="btnSubmitRemoveClass">Remover</button>
                </div>
            </aside>
        `;

        Lists.addClassList();

        DOM.id("btnBack").onclick = () => RootPages.openClassPage();
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
});

export { ClassPages };