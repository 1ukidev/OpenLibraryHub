/**
 * OpenLibraryHub
 * 
 * @version 0.3.8
 * @license GPL-3.0-or-later
 * @author 1ukidev <me@1uki.cloud>
 * @author Leonardo Monteiro <leo.monteiro06@live.com>
 */

import { Pages } from './Pages.mjs';
import { version } from './Constants.mjs';

// Inicialização do site
document.body.onload = () => {
    console.log(`Inicializando OpenLibraryHub (${version})...`);

    if (localStorage.getItem("lock") == null) {
        Pages.openCreateLock();
    } else {
        const lock = JSON.parse(localStorage.getItem("lock"));
        if (lock && lock.status == "unlocked") {
            Pages.openMainHeader();
            Pages.route();
        } else {
            Pages.openLockScreen();
        }
    }

    console.log("Inicializado com sucesso!");
}

// Eventos
window.addEventListener("hashchange", () => {
    Pages.route();
});