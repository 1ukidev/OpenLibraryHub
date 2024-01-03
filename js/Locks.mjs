import { DOM } from "./DOM.mjs";
import { Pages } from "./Pages.mjs";
import { Lock } from "./Abstract.mjs";

const Locks = Object.freeze({
    /**
     * Salva a senha do input no localStorage e desbloqueia a página.
     * 
     * @async
     * @returns {void}
     */
    createLock: async () => {
        console.log("Criando bloqueio...");
        const password = document.getElementById("password").value;

        if (password) {
            const passwordHash = await Locks.SHA256(password);
            const lock = new Lock(passwordHash, "unlocked");
            localStorage.setItem("lock", JSON.stringify(lock));
            DOM.divs.lock.innerHTML = "";
            Pages.openMainHeader();
            Pages.route();
        } else {
            alert('Insira uma senha válida!');
        }
    },

    /**
     * Desbloqueia a página com a senha inserida no input.
     * 
     * @async
     * @returns {void}
     */
    unlock: async () => {
        console.log("Desbloqueando...");
        const password = document.getElementById("password").value;

        if (password) {
            const lock = JSON.parse(localStorage.getItem("lock"));
            const passwordHash = await Locks.SHA256(password);

            if (lock.password == passwordHash) {
                lock.status = "unlocked";
                localStorage.setItem("lock", JSON.stringify(lock));
                DOM.divs.lock.innerHTML = "";
                Pages.openMainHeader();
                Pages.route();
                console.log("Desbloqueado com sucesso!");
            } else {
                alert("Senha incorreta!");
            }
        } else {
            alert("Insira uma senha válida!");
        }
    },

    /**
     * Bloqueia a página.
     * Após o bloqueio, o usuário irá desbloquear utilizando a senha cadastrada.
     * 
     * @returns {void}
     */
    lock: () => {
        console.log("Bloqueando...");
        const lock = JSON.parse(localStorage.getItem("lock"));
        lock.status = "locked";
        localStorage.setItem("lock", JSON.stringify(lock));
        DOM.divs.header.innerHTML = "";
        DOM.divs.content.innerHTML = "";
        DOM.divs.footer.innerHTML = "";
        Pages.openLockScreen();
        console.log("Bloqueado com sucesso!");
    },

    /**
     * Verifica se a página está bloqueada.
     * 
     * @returns {void}
     */
    checkLock: () => {
        if (JSON.parse(localStorage.getItem("lock")).status == "locked") {
            throw new Error("localStorage: a página está bloqueada!");
        }
    },

    /**
     * Criptografa uma senha com SHA256.
     * 
     * @async
     * @param {string} password - Senha a ser criptografada.
     * @returns {string} - Retorna a senha criptografada.
     */
    SHA256: async (password) => {
        const msgBuffer = new TextEncoder().encode(password);                    
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});

export { Locks };