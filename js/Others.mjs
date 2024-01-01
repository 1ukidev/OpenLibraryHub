import { Locks } from "./Locks.mjs";
import { version } from "./Constants.mjs";

export const Others = Object.freeze({
    /**
     * Verifica se há atualizações.
     * 
     * @async
     * @returns {void}
     */
    checkUpdate: async () => {
        console.log("Verificando atualizações...");
        const response = await fetch("https://raw.githubusercontent.com/1ukidev/OpenLibraryHub/main/VERSION");
        const data = await response.text();
      
        console.log(`Versão atual: ${version}`);
        console.log(`Retorno: ${data}`);
      
        if (data.trim() == version) {
            alert("Você está usando a versão mais recente!");
            console.log("Você está usando a versão mais recente!");
        } else {
            alert("Há uma atualização disponível! Acesse 'https://github.com/1ukidev/OpenLibraryHub' para baixar a nova versão.");
            console.log("Há uma atualização disponível! Acesse 'https://github.com/1ukidev/OpenLibraryHub' para baixar a nova versão.");
        }
    },

    /**
     * Faz backup dos dados do localStorage.
     * 
     * @returns {boolean} - Retorna true se o backup foi feito com sucesso.
     */
    makeBackupLocalStorage: () => {
        console.log("Fazendo backup...");
        let values;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            values += localStorage.getItem(key);
        }
        if (values == undefined || values == null) {
            alert("Erro ao fazer backup: nenhum dado encontrado.");
            console.error("Erro ao fazer backup: nenhum dado encontrado.");
            return false;
        }
        const valuesBase64 = btoa(values.replace("undefined", ""));
    
        const link = document.createElement("a");
        link.href = `data:text/plain;base64,${valuesBase64}`;
        link.download = "OpenLibraryHubBackup.txt";
        link.click();
    
        console.log("Backup feito com sucesso!");
    },

    /**
     * Apaga todos os dados do localStorage.
     * 
     * @returns {void}
     */
    deleteLocalStorage: () => {
        console.log("localStorage: apagando todos os dados...");
        Locks.checkLock();
        localStorage.clear();
        location.href = "";
    },

    /**
     * Máscara para inputs de números.
     * 
     * @param {*} event - Evento do input.
     * @returns {boolean} - Retorna true se o input for um número.
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
    }
});