import path from 'path'

module.exports = {
    context: path.resolve(__dirname, 'src'), //(2)
    entry: './index.js', //(3)
    output: {
        path: path.resolve(__dirname, './dist'), //(4)
        filename: 'index.bundle.js' //(5)
    }
}