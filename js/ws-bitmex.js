var bitmexWs = new WebSocket('wss://www.bitmex.com/realtime?subscribe=trade:XBTH17,trade:XBTUSD,trade:.XBT,instrument:XBTUSD,instrument:XBTH17'),
    bitmex = exchanges.bitmex,
    symbolToProduct = {
        XBTUSD: bitmex.products.swap,
        XBTH17: bitmex.products.quarterlies
    }

bitmexWs.onmessage = function (message) {

    var data = JSON.parse(message.data)

    if (data.table == 'trade') {
        data.data.forEach(function (trade) {
            if (trade.symbol == '.XBT') {
                view.updateIndex(bitmex.name, trade.price)
            }
            else {
                view.update(bitmex.name, symbolToProduct[trade.symbol], 'price', trade.price)
            }
        })
    }
    else if (data.table == 'instrument') {
        data.data.forEach(function (info) {
            if (info.hasOwnProperty('volume24h')) {
                view.updateVolume(bitmex.name, symbolToProduct[info.symbol], info.volume24h / 1000)
            }
        })
    }
    else {
        console.log(data);
    }
}
