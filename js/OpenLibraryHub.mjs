/**
 * OpenLibraryHub
 * 
 * @version 0.5.6
 * @license GPL-3.0-or-later
 * @author 1ukidev <me@1uki.cloud>
 * @author Leonardo Monteiro <leo.monteiro06@live.com>
 */

import { DOM } from './lib/DOM.mjs';
import { Pages } from './lib/Pages.mjs';
import { version } from './lib/Constants.mjs';

// Inicialização do site
DOM.body.onload = () => {
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

    // Eventos
    window.addEventListener("hashchange", () => {
        Pages.route();
    });

    console.log("Inicializado com sucesso!");
}