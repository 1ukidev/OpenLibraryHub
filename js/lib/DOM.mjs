const DOM = Object.freeze({
    /**
     * Divs do DOM.
     * 
     * @type {Object}
     */
    divs: Object.freeze({
        lock: window.document.getElementById("lock"),
        header: window.document.getElementById("header"),
        content: window.document.getElementById("content"),
        footer: window.document.getElementById("footer"),
        others: document.getElementById("others")
    }),

    /**
     * Body do DOM.
     * 
     * @type {HTMLElement}
     */
    body: document.body,

    /**
     * Buscar elemento pelo Id.
     * 
     * @param {String} id - Id do elemento.
     * @returns {HTMLElement} Elemento do DOM.
     */
    id: (id) => {
        return document.getElementById(id);
    },

    /**
     * Criar elemento.
     * 
     * @param {string} element - Nome do elemento.
     * @returns {HTMLElement} Elemento do DOM.
     */
    element: (element) => {
        return document.createElement(element);
    }
});

export { DOM };