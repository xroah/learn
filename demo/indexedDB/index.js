const DB_NAME = "TEST";

function getById(id) {
    return document.getElementById(id);
}

function query() {
    let request = indexedDB.open(DB_NAME);

    request.onsuccess = evt => {
        let db = evt.target.result;

        let objectStore = db.transaction("customers").objectStore("customers");

        let data = [];

        objectStore.openCursor().onsuccess = evt => {
            let cursor = evt.target.result;

            if (cursor) {
                data.push(cursor.value);
                cursor.continue();
            } else {
                render(data);
            }
        }
    }
}

function render(data) {
    let html = "";
    let tbody = getById("tbody");
    for (let i = 0, l = data.length; i < l; i++) {
        let tmp = data[i];
        html += `<tr>
                    <td>${tmp.ssn}</td>
                    <td>${tmp.age}</td>
                    <td>${tmp.name}</td>
                    <td>${tmp.email}</td>
                    <td data-id="${tmp.ssn}">
                        <a href="javascript:;" class="edit">edit</a>
                        <a href="javascript:;" class="delete">delete</a>
                    </td>
                 </tr>`;
    }
    if (!html) {
        html = `<td colspan="5">no data</td>`;
    }
    tbody.innerHTML = html;
}

function error(evt) {
    alert(evt.target.error);
}

function add() {
    let request = indexedDB.open(DB_NAME);

    request.onsuccess = evt => {
        let db = request.result;
        let ssn = getById("ssn");
        let age = getById("age");
        let name = getById("name");
        let email = getById("email");
        let transaction = db.transaction("customers", "readwrite");
        let objectStore = transaction.objectStore("customers");
        let data = {
            name: name.value,
            ssn: ssn.value,
            email: email.value,
            age: age.value
        };
        let done = () => {
            ssn.value = age.value = email.value = name.value = "";
            ssn.disabled = false;
            alert("operated successfully");
            query();
        };

        let updateReq = objectStore.put(data);
        updateReq.onsuccess = done;
    }
}

function clear() {
    let request = indexedDB.open(DB_NAME);

    request.onsuccess = evt => {
        let db = evt.target.result;
        let objectStore = db.transaction("customers", "readwrite").objectStore("customers");

        let req = objectStore.clear();

        req.onsuccess = () => {
            alert("cleared successfully");
            query();
        }

        req.onerror = error;
    }
}

function edit(id) {
    let request = indexedDB.open(DB_NAME);

    request.onsuccess = () => {
        let db = request.result;
        let objectStore = db.transaction("customers").objectStore("customers");
        let req = objectStore.get(id);

        req.onsuccess = () => {
            let ssn = getById("ssn");
            let age = getById("age");
            let name = getById("name");
            let email = getById("email");

            let ret = req.result;
            ssn.value = ret.ssn;
            age.value = ret.age;
            name.value = ret.name;
            email.value = ret.email;

            ssn.disabled = true;
        }
    }
}

function del(id) {
    let request = indexedDB.open(DB_NAME);

    request.onsuccess = () => {
        let objectStore = request.result.transaction("customers", "readwrite").objectStore("customers");

        let delReq = objectStore.delete(id);

        delReq.onerror = error;

        delReq.onsuccess = () => {
            alert("deleted successfully");
            query();
        }
    }
}

function init() {
    let request = indexedDB.open(DB_NAME);
    request.addEventListener("error", evt => {
        console.log("Error");
    });
    request.addEventListener("upgradeneeded", evt => {
        let db = evt.target.result;
        let objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("email", "email", { unique: true });
    });
    query();
    initEvent();
}

function initEvent() {
    let addEl = getById("add");
    let clearEl = getById("clear");
    let tbody = getById("tbody");
    let updateEl = getById("update");

    addEl.addEventListener("click", add);
    clearEl.addEventListener("click", clear);
    updateEl.addEventListener("click", add);

    tbody.addEventListener("click", evt => {
        let target = evt.target;
        let id = target.parentNode.dataset.id;
        if (target.classList.contains("edit")) {
            edit(id);
        } else if (target.classList.contains("delete")) {
            del(id);
        }
    });
}

init();

