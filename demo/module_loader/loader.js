!function () {
    var REQUIRE_RE = /require\s*\(['"](.+)['"]\)/g;
    var doc = document;
    var loadedMap = {};
    var factories = {};
    var entry;

    function use(module) {
        if (!entry) entry = resolve(module);
        addScript(module);
    }

    function noop() { }

    function isFunction(fn) {
        return typeof fn === "function";
    }

    function addScript(src, callback) {
        if (!isFunction(callback)) callback = noop;
        if (!src) return;
        if (loadedMap[src]) return callback();
        var script = doc.createElement("script");

        src = handleExtension(src);

        script.src = src;

        script.onload = script.onerror = function () {
            doc.body.removeChild(script);
            loadedMap[src] = true;
            callback();
        }

        doc.body.appendChild(script);
    }

    function parseDependencies(str) {
        var ret = [];

        str.replace(REQUIRE_RE, function (m, m1) {
            ret.push(m1);
        });

        return ret;
    }

    function getCurrentScriptSrc() {
        return document.currentScript.src;
    }

    function endsWith(str, end) {
        if (typeof str !== "string" || typeof end !== "string") return false;
        var len = end.length;
        var strArr = str.split("").reverse();
        var _end = strArr.slice(0, len).reverse().join("");
        return end === _end;
    }

    function handleExtension(module) {
        if (!endsWith(module, ".js")) {
            module = module + ".js";
        }
        return module;
    }

    function resolve(module) {
        var script = document.createElement("script");
        script.src = handleExtension(module);
        return script.src;
    }

    var remain = 0;

    function define(factory) {
        if (!isFunction(factory)) return;
        var deps = parseDependencies(factory.toString());
        remain += deps.length;
        var i = 0, len = remain;
        let curSrc = getCurrentScriptSrc();
        factories[curSrc] = factory;
        for (; i < len; i++) {
            var tmp = deps[i];
            if (loadedMap[tmp]) {
                remain--;
                continue;
            };
            addScript(tmp, function() {
                remain--;
                if (remain === 0) {
                    factories[entry](require);
                }
            });
        }
    }

    function require(module) {
        var mod = {
            exports: undefined
        };
        module = resolve(module);
        if (factories[module]) {
            var _mod = factories[module](require, mod.exports, mod);
        }
        return _mod ? _mod : mod.exports;
    }

    window.mLoader = {
        use: use
    };

    window.define = define;
}();