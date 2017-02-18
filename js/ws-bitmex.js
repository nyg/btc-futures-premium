var bitmexWs = new WebSocket('wss://www.bitmex.com/realtime?subscribe=trade:XBTH17,trade:XBTUSD,trade:.XBT,instrument:XBTUSD,instrument:XBTH17'),
    bitmex = exchanges.bitmex

bitmexWs.onmessage = function (message) {

    var data = JSON.parse(message.data)

    if (data.table == 'trade') {
        data.data.forEach(function (trade) {
            if (trade.symbol == '.XBT') {
                view.updateIndex(bitmex.name, trade.price)
            }
            else if (trade.symbol == 'XBTUSD') {
                view.update(bitmex.name, bitmex.products.swap, 'price', trade.price)
            }
            else if (trade.symbol == 'XBTH17') {
                view.update(bitmex.name, bitmex.products.quarterlies, 'price', trade.price)
            }
            else {
                console.log('Unknown symbol: ' + trade.symbol)
            }
        })
    }
    else if (data.table == 'instrument') {
        data.data.forEach(function (info) {
            if (info.hasOwnProperty('volume24h')) {
                if (info.symbol == 'XBTUSD') {
                    view.update(bitmex.name, bitmex.products.swap, 'volume', info.volume24h / 1000)
                }
                else if (info.symbol == 'XBTH17') {
                    view.update(bitmex.name, bitmex.products.quarterlies, 'volume', info.volume24h / 1000)
                }
                else {
                    console.log('Unknown symbol: ' + trade.symbol)
                }
            }
        })
    }
    else {
        console.log(data);
    }
}
