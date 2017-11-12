var view = (() => {

    var view = {},
        volumes = []

    view.newExchange = (name) => {

        var table = ui.table(jnid(name)),
            caption = ui.caption(name + ' (index: ')

        caption.appendChild(ui.span(null, jnid(name, 'index')))
        caption.insertAdjacentText('beforeend', ', min: ')
        caption.appendChild(ui.span(null, jnid(name, 'index-min')))
        caption.insertAdjacentText('beforeend', ', max: ')
        caption.appendChild(ui.span(null, jnid(name, 'index-max')))
        caption.insertAdjacentText('beforeend', ')')

        table.appendChild(caption)
        table.appendChild(ui.tr([
            ui.th(),
            ui.th('Vol 24h k$'),
            ui.th(),
            ui.th('Last'),
            ui.th('±'),
            ui.th('%')
        ]))

        ui.id('exchanges').appendChild(table)
    }

    view.newProduct = (exchange, name) => {

        var product = ui.th(name),
            baseId = jnid(exchange, name),
            volume = ui.td(null, jnid(baseId, 'volume')),
            volumep = ui.td(null, jnid(baseId, 'volumep')),
            price = minMaxCell(baseId, 'price'),
            delta = minMaxCell(baseId, 'delta'),
            deltap = minMaxCell(baseId, 'deltap'),
            tr = ui.tr([ product, volume, volumep, price, delta, deltap ])

        ui.id(jnid(exchange)).appendChild(tr)
    }

    view.update = (exchange, product, property, newValue) => {

        var id = jnid(exchange, product, property, 'value'),
            oldValue = getValue(id)

        setValue(id, newValue)
        setValueStyle(id, oldValue, newValue)
        setMinMaxValue(jnid(exchange, product, property), newValue)

        if (property == 'price') {
            updateDelta(exchange, product)
        }
    }

    view.updateIndex = (exchange, newValue) => {

        var id = jnid(exchange, 'index'),
            oldValue = getValue(id)

        setValue(id, newValue)
        setValueStyle(id, oldValue, newValue)
        setMinMaxValue(id, newValue)

        forEach(exchanges[exchange.toLowerCase()].products, (key, value) => {
            updateDelta(exchange, value)
        })
    }

    view.updateVolume = (exchange, product, newValue) => {

        var id = jnid(exchange, product, 'volume'),
            oldValue = getValue(id)

        setVolumeValue(id, newValue)
        setValueStyle(id, oldValue, newValue)

        computePercentage()
    }

    view.restoreMinMaxValues = id => {
        var minId = jnid(id, 'min'),
            maxId = jnid(id, 'max')
        setValue(minId, storage.get(minId), false)
        setValue(maxId, storage.get(maxId), false)
    }

    view.buildUI = () => {

        forEach(exchanges, (key, exchange) => {

            view.newExchange(exchange.name)
            view.restoreMinMaxValues(jnid(exchange.name, 'index'))

            forEach(exchange.products, (key, product) => {
                view.newProduct(exchange.name, product);
                [ 'price', 'delta', 'deltap' ].forEach(e => {
                    view.restoreMinMaxValues(jnid(exchange.name, product, e))
                })
            })
        })
    }

    function computePercentage() {

        var totalVolume = 0
        forEach(exchanges, (key, exchange) => {
            forEach(exchange.products, (key, product) => {
                totalVolume += getIntValue(jnid(exchange.name, product, 'volume'))
            })
        })

        forEach(exchanges, (key, exchange) => {
            forEach(exchange.products, (key, product) => {
                var volume = getIntValue(jnid(exchange.name, product, 'volume')),
                    percentage = 100 * volume / totalVolume
                if (!isNaN(percentage)) {
                    ui.id(jnid(exchange.name, product, 'volumep')).textContent = percentage.toFixed(1) + '%'
                }
            })
        })
    }

    function updateDelta(exchange, product) {

        var index = getValue(jnid(exchange, 'index')),
            price = getValue(jnid(exchange, product, 'price', 'value')),
            delta = price - index

        view.update(exchange, product, 'delta', delta)
        view.update(exchange, product, 'deltap', delta / index * 100)
    }

    function minMaxCell (parentId, name) {

        var baseId = jnid(parentId, name),
            max = ui.span(null, jnid(baseId, 'max'), 'fx-mmc-max'),
            value = ui.span(null, jnid(baseId, 'value'), 'fx-mmc-val'),
            min = ui.span(null, jnid(baseId, 'min'), 'fx-mmc-min')

        return ui.td([ ui.span([ max, value, min ], baseId, 'fx-mmc-main') ])
    }

    function getIntValue(id) {
        return parseInt(ui.id(id).textContent.replace(/,/g, ''))
    }

    // gets the exact value from the span with given id
    function getValue(id) {
        return parseFloat(ui.id(id).getAttribute('exact-value'))
    }

    // updates the span with given id
    function setValue(id, value, store) {

        var parsedValue = parseFloat(value)
        if (isNaN(parsedValue) || !isFinite(parsedValue)) {
            return
        }

        ui.id(id).textContent = parsedValue.toFixed(2)
        ui.id(id).setAttribute('exact-value', value)

        // only store if it's a min/max value
        if (store != false && id.match(/min|max/)) {
            storage.set(id, parsedValue)
        }
    }

    function setVolumeValue(id, value) {
        ui.id(id).textContent = Number(value.toFixed()).toLocaleString()
    }

    // colors the span with given id
    function setValueStyle(id, value, newValue) {

        if (newValue > value) {
            ui.id(id).style.color = 'green'
        }
        else if (newValue < value) {
            ui.id(id).style.color = 'red'
        }
    }

    // updates the min/max values corresponding to the span with the given id
    function setMinMaxValue(id, value) {

        var minId = jnid(id, 'min'),
            maxId = jnid(id, 'max'),
            min = storage.get(minId),
            max = storage.get(maxId)

        if (min == null || value < min) {
            setValue(minId, value)
        }

        if (max == null || value > max) {
            setValue(maxId, value)
        }
    }

    // joins the given arguments, used for HTML ids
    function jnid() {
        return [].join.call(arguments, '-').toLowerCase().replace(' ', '-')
    }

    return view
})()

// Add onclick events on min/max buttons
function clearMinValues() {
    storage.unset(/min/)
}

function clearMaxValues() {
    storage.unset(/max/)
}

function clearAllValues() {
    storage.unset(/min|max/)
}

ui.id('clear-min').onclick = clearMinValues
ui.id('clear-max').onclick = clearMaxValues
ui.id('clear-all').onclick = clearAllValues
