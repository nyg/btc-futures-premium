var bitmexExchange = {
        name: 'BitMEX',
        products: {
            XBTUSD: 'Perpetual Swap'
        }
    },
    futures = undefined

function getFutures() {
    return nygFetch
        .fetchJSON('https://www.bitmex.com/api/v1/instrument?filter=%7B%22rootSymbol%22%3A%22XBT%22%2C%22state%22%3A%22Open%22%2C%22typ%22%3A%20%22FFCCSX%22%7D&reverse=false', true)
        .then(json => json.json.map(e => e.symbol))
}

async function buildBitmexExchange() {

    futures = await getFutures()
    for (future of futures) {
        bitmexExchange.products[future] = getSymbolName(future)
    }

    exchanges.bitmex = bitmexExchange
}

function startBitMEXWebSocket() {

    var ws = new WebSocket(`wss://www.bitmex.com/realtime?subscribe=trade:.XBT,trade:XBT:perpetual,instrument:XBT:perpetual,${createFuturesWSString(futures)}`)
    ws.onmessage = function (message) {

        var data = JSON.parse(message.data)

        if (data.table == 'trade') {
            for (trade of data.data) {
                if (trade.symbol == '.XBT') {
                    view.updateIndex(bitmexExchange.name, trade.price)
                }
                else {
                    view.update(bitmexExchange.name, bitmexExchange.products[trade.symbol], 'price', trade.price)
                }
            }
        }
        else if (data.table == 'instrument') {
            for (instrument of data.data) {
                if (instrument.hasOwnProperty('volume24h')) {
                    view.updateVolume(bitmexExchange.name, bitmexExchange.products[instrument.symbol], instrument.volume24h / 1000)
                }
            }
        }
        else {
            console.log(data);
        }
    }
}

function createFuturesWSString(symbols) {
    return symbols.map(symbol => `trade:${symbol},instrument:${symbol}`).join(',')
}

function getSymbolName(symbol) {

    var matched = symbol.match(/XBT([A-Z])(\d\d)/)
    if (matched.length == 3) {
        return getMonth(matched[1]) + ' \'' + matched[2]
    }

    return 'Unknown future symbol'
}

function getMonth(code) {
    switch (code) {
        case 'F': return 'January'
        case 'G': return 'February'
        case 'H': return 'March'
        case 'J': return 'April'
        case 'K': return 'May'
        case 'M': return 'June'
        case 'N': return 'July'
        case 'Q': return 'August'
        case 'U': return 'September'
        case 'V': return 'October'
        case 'X': return 'November'
        case 'Z': return 'December'
        default: return 'Unknown month code'
    }
}
