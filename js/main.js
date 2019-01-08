// define exchanges and their products
var exchanges = {
    bitmex: null,
    okcoin: okcoinExchange
}

buildBitmexExchange()
.then(view.buildUI)
.then(startOKCoinWebSocket)
.then(startBitMEXWebSocket)
