const styledLog = (styleObj = { colour: 'black', style: 'normal', blankLine: 0 }, text = 'Default log content') => {

    const allowedColours = [
        'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'
    ]

    const allowedStyles = [
        'normal', 'bold', 'italic', 'boldItalic', 'underlined'
    ]

    const getColourCode = () => {
        if (styleObj.colour === 'red') {
            return 31
        } else if (styleObj.colour === 'green') {
            return 32
        } else if (styleObj.colour === 'yellow') {
            return 33
        } else if (styleObj.colour === 'blue') {
            return 34
        } else if (styleObj.colour === 'magenta') {
            return 35
        } else if (styleObj.colour === 'cyan') {
            return 36
        } else if (styleObj.colour === 'white') {
            return 37
        } else {
            return 32
        }
    }

    const getStyleCode = () => {
        if (styleObj.style == 'normal') {
            return ``
        } else if (styleObj.style == 'bold') {
            return `\x1b[1m`
        } else if (styleObj.style == 'underline') {
            return `\x1b[4m`
        } else if (styleObj.style == 'boldUnderline') {
            return `\x1b[1m\x1b[4m`
        }
    }

    const getBlankLineCode = () => {
        let returnString = ``
        for (var i = 0; i < styleObj.blankLine; i++) {
            returnString += `\n`
        }

        return returnString
    }

    let colourANSI = `\x1b[${getColourCode()}m`
    let styleANSI = getStyleCode()
    let normalizeANSI = `\x1b[0m`



    console.log(`${styleANSI}${colourANSI}%s${normalizeANSI}`, `${text}${getBlankLineCode()}`)
}

module.exports = styledLog