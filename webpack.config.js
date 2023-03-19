import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    context: path.resolve(__dirname, 'yzuicflowchart'), //(2)
    target: 'node',
    entry: {
        'index': '../www'
    }, //(3)
    output: {
        path: path.resolve(__dirname, './dist'), //(4)
        filename: '[name].bundle.js' //(5)
    }
}