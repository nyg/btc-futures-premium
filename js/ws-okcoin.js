new OKCoin('com', {
    ok_sub_futureusd_btc_index: handleIndex,
    ok_sub_futureusd_btc_trade_this_week: handleTrade,
    ok_sub_futureusd_btc_trade_next_week: handleTrade,
    ok_sub_futureusd_btc_trade_quarter: handleTrade,
    ok_sub_futureusd_btc_ticker_this_week: handleTicker,
    ok_sub_futureusd_btc_ticker_next_week: handleTicker,
    ok_sub_futureusd_btc_ticker_quarter: handleTicker
}).start()

var okcoin = exchanges.okcoin

function handleIndex(message) {
    view.updateIndex(okcoin.name, message.data.futureIndex)
}

function handleTrade(message) {

    message.data.forEach(function (trade) {

        var price = parseFloat(trade[1])

        if (message.channel.match(/this_week/)) {
            view.update(okcoin.name, 'weeklies', 'price', price)
        }
        else if (message.channel.match(/next_week/)) {
            view.update(okcoin.name, 'bi-weeklies', 'price', price)
        }
        else if (message.channel.match(/quarter/)) {
            view.update(okcoin.name, 'quarterlies', 'price', price)
        }
        else {
            console.log('Unknown channel: ' + message.channel)
        }
    })
}

function handleTicker(message) {

    var volume = parseFloat(message.data.vol) / 10 // in K$

    if (message.channel.match(/this_week/)) {
        view.update(okcoin.name, 'weeklies', 'volume', volume)
    }
    else if (message.channel.match(/next_week/)) {
        view.update(okcoin.name, 'bi-weeklies', 'volume', volume)
    }
    else if (message.channel.match(/quarter/)) {
        view.update(okcoin.name, 'quarterlies', 'volume', volume)
    }
    else {
        console.log('Unknown channel: ' + message.channel)
    }
}
