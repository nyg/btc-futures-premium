var storage = (function () {

    var storage = {},
        isSupported = typeof Storage !== "undefined"

    storage.get = function (key) {
        if (isSupported) {
            return localStorage.getItem(key)
        }
    }

    storage.set = function (key, value) {
        if (isSupported) {
            localStorage.setItem(key, value)
        }
    }

    storage.unset = function (regex) {
        if (isSupported) {
            for (var i = localStorage.length - 1; i >= 0; --i) {
                var key = localStorage.key(i)
                if (key.match(regex)) {
                    localStorage.removeItem(key)
                }
            }
        }
    }

    return storage
})()
