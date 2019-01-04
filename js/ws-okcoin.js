var okcoinExchange = {
        name: 'OKCoin',
        products: {
            quarterlies: 'Quarterlies',
            biWeeklies: 'Bi-Weeklies',
            weeklies: 'Weeklies'
        }
    },
    channelToProduct = {
        this_week: okcoinExchange.products.weeklies,
        next_week: okcoinExchange.products.biWeeklies,
        quarter: okcoinExchange.products.quarterlies
    }

function startOKCoinWebSocket() {
    new OKCoin('wss://real.okex.com:10441/websocket')
        .addChannelHandler('ok_sub_futureusd_btc_index', handleIndex)
        .addChannelHandler('ok_sub_futureusd_btc_trade_this_week', handleTrade)
        .addChannelHandler('ok_sub_futureusd_btc_trade_next_week', handleTrade)
        .addChannelHandler('ok_sub_futureusd_btc_trade_quarter', handleTrade)
        .addChannelHandler('ok_sub_futureusd_btc_ticker_this_week', handleTicker)
        .addChannelHandler('ok_sub_futureusd_btc_ticker_next_week', handleTicker)
        .addChannelHandler('ok_sub_futureusd_btc_ticker_quarter', handleTicker)
        .start()
}

// Index data
function handleIndex(message) {
    view.updateIndex(okcoinExchange.name, message.data.futureIndex)
}

// Last trade data
function handleTrade(message) {
    message.data.forEach(function (trade) {
        view.update(okcoinExchange.name, getProduct(message.channel), 'price', parseFloat(trade[1]))
    })
}

// Volume data
function handleTicker(message) {
    var volume = parseFloat(message.data.vol) / 10 // in k$
    view.updateVolume(okcoinExchange.name, getProduct(message.channel), volume)
}

function getProduct(channel) {

    var product
    forEach(channelToProduct, function (key, value) {
        if (channel.match(new RegExp(key))) {
            product = value
        }
    })

    if (product !== undefined) {
        return product
    }
    else {
        console.log('Unknown channel: ' + channel)
    }
}
