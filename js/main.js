// define exchanges and their products
var exchanges = {
    okcoin: okcoinExchange
}

buildBitmexExchange()
.then(view.buildUI)
.then(startOKCoinWebSocket)
.then(startBitMEXWebSocket)
