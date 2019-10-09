class CustomButton extends HTMLButtonElement {
    constructor() {
        super();
        this.classList.add("btn");
        this.btnType && this.classList.add(`btn-${this.btnType}`);
    }

    static get observedAttributes() {
        return ["btntype"];
    }

    connectedCallback() {
        console.log("mounted")
    }

    disconnectedCallback() {
        console.log("unmounted")
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`name=${name}, oldValue=${oldValue}, newValue=${newValue}`);
        console.log("attribute change")
    }

    get btnType() {
        return this.getAttribute("btnType");
    }

    set btnType(val) {
        const typeMap = {
            primary: true,
            secondary: true,
            success: true,
            danger: true,
            warning: true,
            info: true,
            light: true,
            dark: true,
            link: true
        };
        if (val != null) {
            if (!typeMap[val]) return;
            this.classList.add(`btn-${val}`);
            this.setAttribute("btnType", val);
        } else {
            this.classList.remove(`btn-${this.btnType}`);
            this.removeAttribute("btnType");
        }
    }
}

setTimeout(() => {
    customElements.define("custom-button", CustomButton, { extends: "button" });
}, 5000);

customElements.whenDefined("custom-button").then(el => {
    console.log("defined")
});