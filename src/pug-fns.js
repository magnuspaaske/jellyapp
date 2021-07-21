// Various functions to be used in the frontend

const _         = require('lodash')
const showdown  = require('showdown')


const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const numberToString = (num, qualifications) => {
    if (qualifications === undefined) {
        qualifications = []
    } else if (!Array.isArray(qualifications)) {
        qualifications = [qualifications]
    }

    let number

    // Allows us to present the number as ${num}${roman}(+). This is to make big numbers easier to read
    if (_.includes(qualifications, 'present-format')) {
        const log = Math.log(num) / Math.log(10)
        if (log < 2) {
            number = num.toString()
        } else if (log < 3) {
            number = (Math.floor(num / 10) * 10).toString()
        } else if (log < 4) {
            // number = num.toString()
            number = (Math.floor(num / 100) / 10) + 'K'
        } else if (log < 5) {
            number = Math.floor(num / 1000) + 'K'
        } else if (log < 6) {
            number = (Math.floor(num / 10000) * 10) + 'K'
        } else if (log < 7) {
            number = (Math.floor(num / 100000) / 10) + 'M'
        }

    } else {
        number = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    if (_.includes(qualifications, 'about')) number = `~${number}`
    if (_.includes(qualifications, 'plus')) number = `${number}+`

    return number
}

const transformToPercentage = (num) => {
    return (Math.round(num * 1000) / 10)
}

const formatMoney = (int, {
    currency        = {code: 'usd', 'symbol': '$'},
    decimals        = 2,
    format          = 'precise',
    showCode        = false,
    showDecimals    = false,
    showSymbol      = true,
} = {}) => {
    const cur = currency.attributes ? currency.serialize() : currency

    let money = ''

    if (showSymbol) money = `${cur.symbol} `

    if (format === 'precise') {
        money += numberToString(Math.floor(int/100))
        // Figure out what to show
        if (showDecimals) {
            money += `.${String((int % 100) / 100).replace('0.', '').slice(0, decimals)}`
        }
    } else if (format === 'presentation') {
        money += numberToString(Math.floor(int/100), 'present-format')
    }


    if (showCode) {
        money += ` ${cur.code.toUpperCase()}`
    }

    return money
}


function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}


module.exports = {
    capitalize,
    formatMoney,
    numberToString,
    showdown: new showdown.Converter(),
    transformToPercentage,
    getFlagEmoji,
}
