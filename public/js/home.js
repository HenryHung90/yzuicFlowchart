import { loadingPage } from '../global/common.js'
loadingPage(true)

const homeInit = async () => {


    loadingPage(false)
}

window.addEventListener('DOMContentLoaded', homeInit)