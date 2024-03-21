const styledLog = require("./styledLog")

const getReqId = (type = 'TXN') => {
    const allowedTypes = [
        'TXN' //Transaction
    ]

    if (!(allowedTypes.includes(type))) {
        styledLog({ colour: "red", style: "bold", blankLine: 5 }, "✘ DEV ERROR: getReqId() requires a type parameter. If blank, it defaults to 'TXN'.")
    }

    const timestamp = Date.now()

    return `${type}${timestamp}`
}

module.exports = getReqId