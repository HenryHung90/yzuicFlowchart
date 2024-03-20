import { socketConnect } from "../../global/socketConnect.js"
import { ClickListening} from "../../global/common.js"
import { studentClientConnect } from "../../global/axiosconnect.js"
import customizeOperation from "./customizeOperation.js"

const coworkInit = () => {
    if (customizeOperation.getFrontEndCode('coworkStatus') === 'N') return

    //偵測鼠標移動
    socketConnect.cowork.mouseMove()
    //監聽其他人滑鼠移動
    socketConnect.cowork.receiveMouseMove()
    // 監聽是否有人按下執行程式
    socketConnect.cowork.receiveExecuteProject()
    // 監聽投票事件
    socketConnect.cowork.receiveVoting()

}

export { coworkInit }