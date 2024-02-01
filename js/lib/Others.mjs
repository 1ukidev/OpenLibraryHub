import { Locks } from "./Lock/Locks.mjs";
import { DOM } from "./DOM.mjs";
import { version } from "./Constants.mjs";

const Others = Object.freeze({
    /**
     * Verifica se há atualizações.
     * 
     * @returns {void}
     */
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
                alert("Não foi possível buscar por atualizações: " + error);
                throw new Error("Não foi possível buscar por atualizações: " + error);
            });
    },

    /**
     * Faz backup dos dados do localStorage.
     * 
     * @returns {void}
     */
    makeBackupLocalStorage: () => {
        console.log("Fazendo backup...");
    
        const keys = Object.keys(localStorage);
        if (keys.length === 0) {
            alert("Erro ao fazer backup: nenhum dado encontrado.");
            throw new Error("Erro ao fazer backup: nenhum dado encontrado.");
        }
    
        const data = {};
        keys.forEach(key => {
            data[key] = localStorage.getItem(key);
        });
    
        const jsonBackupData = JSON.stringify(data);
    
        const blob = new Blob([jsonBackupData], { type: "application/json" });
        const link = DOM.element("a");
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        link.href = URL.createObjectURL(blob);
        link.download = `OpenLibraryHubBackup (${new Date().toLocaleString('pt-BR', dateOptions)}).json`;
        link.click();
    
        console.log("Backup feito com sucesso!");
    },

    /**
     * Recupera os dados do backup.
     * 
     * @returns {void}
     */
    recoverBackupLocalStorage: () => {
        console.log("Recuperando backup...");
        const input = DOM.element("input");
        input.type = "file";
        input.accept = ".json";
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (event) => {
                    try {
                        const jsonData = JSON.parse(event.target.result);
                        localStorage.clear();
                        Object.keys(jsonData).forEach(key => {
                            localStorage.setItem(key, jsonData[key]);
                        });
                        location.href = "";
                    } catch (error) {
                        alert("Erro ao recuperar o backup.");
                        throw new Error("Erro ao recuperar o backup.");
                    }
                };
            }
        };
    },

    /**
     * Apaga todos os dados do localStorage.
     * 
     * @returns {void}
     */
    deleteLocalStorage: () => {
        console.log("localStorage: apagando todos os dados...");
        Locks.checkLock();

        let msg = "Tem certeza que deseja apagar todos os dados?\n";
        msg += "Todos os dados serão perdidos!\n";

        if (confirm(msg)) {
            localStorage.clear();
            location.href = "";
        }
    },

    /**
     * Máscara para inputs de números.
     * 
     * @param {*} event - Evento do input.
     * @returns {boolean} Retorna true se o input for um número.
     * @returns {boolean} Retorna false se o input não for um número.
     */
    numberMask: (event) => {
        const validKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
        
        if (validKeys.includes(event.code)) {
            return true;
        } else if (!isNaN(Number(event.key)) && event.code !== 'Space') {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Verifica aonde o site está sendo acessado.
     * 
     * @returns {string} Retorna a pasta correta das imagens.
     */
    checkURL: () => {
        if (!(location.href.indexOf("github") > -1)) {
            return "/src";
        } else {
            return "/OpenLibraryHub/src";
        }
    }
});

export { Others };