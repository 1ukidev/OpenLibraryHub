/**
 * OpenLibraryHub
 * 
 * @version 0.6.2
 * @license GPL-3.0-or-later
 * @author Leonardo Monteiro <leo.monteiro06@live.com>
 * @author Emanuel Ferreira <emanuel2005batista@gmail.com>
 */

import { DOM } from './lib/DOM.mjs';
import { RootPages } from './lib/RootPages.mjs';
import { version } from './lib/Constants.mjs';

// Inicialização do site
DOM.body.onload = () => {
    console.log(`Inicializando OpenLibraryHub (${version})...`);

    if (localStorage.getItem("lock") == null) {
        RootPages.openCreateLock();
    } else {
        const lock = JSON.parse(localStorage.getItem("lock"));
        if (lock && lock.status == "unlocked") {
            RootPages.openMainHeader();
            RootPages.route();
        } else {
            RootPages.openLockScreen();
        }
    }

    // Eventos
    window.addEventListener("hashchange", () => {
        RootPages.route();
    });

    console.log("Inicializado com sucesso!");
}