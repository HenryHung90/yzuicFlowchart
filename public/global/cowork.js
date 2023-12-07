import { socketConnect } from "../../global/socketConnect.js"
import { ClickListening, NormalizeFunc } from "../../global/common.js"
import { studentClientConnect } from "../../global/axiosconnect.js"


const coworkInit = () => {
    if (NormalizeFunc.getFrontEndCode('coworkStatus') === 'N') return

    //偵測鼠標移動
    socketConnect.cowork.mouseMove()
    //監聽其他人滑鼠移動
    socketConnect.cowork.receiveMouseMove()

}

export { coworkInit }