// Edit a file to insert new lines for sessions/routes/models/etc

const _ = require('lodash')
const fs = require('fs')


const cwd = process.cwd()


const insertLinesInFile = ({
    fileLocation = null,
    lines = null,
    symbol = null,
} = {}) => {
    if (!fileLocation || !lines || !symbol) {
        const txt = 'fileLocation, lines and sybmol must all be set before insertLinesInFile works'
        throw new Error(txt)
    }

    // Load file to be edited
    const fileLoc = `${cwd}/${fileLocation}`
    const file = fs.readFileSync(fileLoc, 'utf8')
    let fileLines = file.split(/\r?\n/)

    const topLine = '// Lines inserted with the jelly cli, edit freely'
    lines = `\n${topLine}\n${lines.trim()}`

    const firstLineIndex = fileLines.indexOf(`//- JELLY: ${symbol}`)
    const lastLineIndex = fileLines.indexOf(`//- JELLY: /${symbol}`)

    if (firstLineIndex === -1 || lastLineIndex === -1 || lastLineIndex < firstLineIndex) {
        const txt = `insertLinesInFile has failed as the ${symbol} symbol can't be found in the ${fileLocation} file or ${fileLocation} is corrupted`
        throw new Error(txt)
    }

    // Inserting lines
    // fileLines.splice(lastLineIndex, 0, lines)

    // Writing new file
    let newFile = ''
    _(fileLines).each((line, i) => {
        if (i === lastLineIndex -1) {
            if (line === '') {
                newFile += `${lines}`
            } else {
                newFile += `${line}\n${lines}`
            }
        } else {
            newFile += `${line}`
        }
        if (i < fileLines.length - 1) {
            newFile += '\n'
        }
    })

    fs.writeFileSync(fileLoc, newFile)
}

module.exports = insertLinesInFile
