// define exchanges and their products
// TODO add cryptofacilities.com and deribit.com...
var exchanges = {
    okcoin: okcoinExchange
}

buildBitmexExchange()
.then(view.buildUI)
.then(startOKCoinWebSocket)
.then(startBitMEXWebSocket)
