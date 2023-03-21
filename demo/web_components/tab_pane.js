class TabPane extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    width: 300px;
                    padding: 10px;
                    margin-top: 10px;
                    text-align: justify;
                }
            </style>
            <div class="tab-pane">
                <slot></slot>
            </div>
        `;
    }

    get name() {
        return this.getAttribute("name");
    }
}

customElements.define("tab-pane", TabPane);