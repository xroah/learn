class FancyTab extends HTMLElement {
    currentTab = null;

    constructor() {
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                .tag {
                    padding: 10px;
                    text-decoration: none;
                    outline: none;
                    color: #666;
                }
                .tag.active {
                    border-bottom: 2px solid #1890ff;
                }
                ::slotted(tab-pane) {
                    display: none;
                }
                ::slotted(tab-pane.visible) {
                    display: block;
                }
            </style>
            <div class="tab-wrapper">
                <div class="tab-title"></div>
                <div class="tab-content">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    initEvent() {
        this.shadowRoot.addEventListener("click", this.switchActive);
    }

    switchActive = evt => {
        const node = evt.target;
        if (!node.isTab) return;
        const active = this.shadowRoot.querySelector(".active");
        active && active.classList.remove("active");
        node.classList.add("active");
        node.tabContent.classList.add("visible");
        if (this.currentTab) {
            this.currentTab.classList.remove("visible");
        }
        this.currentTab = node.tabContent;
        evt.preventDefault && evt.preventDefault();
    }

    connectedCallback() {
        const slot = this.shadowRoot.querySelector("slot");
        const children = slot.assignedNodes();
        const frag = document.createDocumentFragment();
        const defaultActive = +this.getAttribute("defaultActive") || 0;
        let active;
        let index = 0;

        Array.from(children).forEach(node => {
            if (node.nodeName.toLowerCase() !== "tab-pane") {
                node.remove();
            } else {
                const a = document.createElement("a");
                a.href = "#";
                a.classList.add("tag");
                a.innerHTML = node.getAttribute("name");
                a.tabContent = node;
                a.index = index;
                a.isTab = true;
                if (index === defaultActive) active = a;
                index++;
                frag.appendChild(a);
            }
        });
        this.shadowRoot.querySelector(".tab-title").append(frag);

        if (active) {
            this.switchActive({target: active});
        }

        this.initEvent();
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.switchActive);
    }
}

customElements.define("fancy-tab", FancyTab);