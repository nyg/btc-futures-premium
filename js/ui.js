var ui = (function () {

    var ui = {}

    ui.id = function (elementId) {
        return document.getElementById(elementId)
    }

    ui.table = function (id) {
        var table = el('table')
        table.setAttribute('id', id)
        return table
    }

    ui.caption = function (content) {
        return el('caption', content)
    }

    ui.tr = function (children) {

        var tr = el('tr')

        if (Array.isArray(children)) {
            children.forEach(function (e) {
                tr.appendChild(e)
            })
        }

        return tr
    }

    ui.th = function (content) {
        return ui.td(content, null, true)
    }

    ui.td = function (content, id, th) {

        var td = el(th == true ? 'th' : 'td')

        if (typeof id == 'string') {
            td.setAttribute('id', id)
        }

        if (Array.isArray(content)) {
            content.forEach(function (e) {
                td.appendChild(e)
            })
        }
        else if (content != null) {
            td.textContent = content
        }

        return td
    }

    ui.span = function (content, id, className) {

        var span = el('span')

        if (typeof id == 'string') {
            span.setAttribute('id', id)
        }

        if (typeof className == 'string') {
            span.setAttribute('class', className)
        }

        if (Array.isArray(content)) {
            content.forEach(function (e) {
                span.appendChild(e)
            })
        }
        else if (content != null) {
            span.textContent = content
        }

        return span
    }

    function el(name, content) {
        var e = document.createElement(name)
        if (typeof content == 'string') {
            e.insertAdjacentHTML('afterbegin', content)
        }
        return e
    }

    return ui
})()
