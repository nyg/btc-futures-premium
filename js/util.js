// helper to loop through an object's properties
function forEach(obj, fn) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            fn(key, obj[key])
        }
    }
}
