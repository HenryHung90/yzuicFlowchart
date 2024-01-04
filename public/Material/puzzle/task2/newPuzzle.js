// 階段二: 將 Puzzle 全部印在場上，並隨機使其中一張消失
// => random 應用, 綜合應用
let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: '#4488aa',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: "container",
});

//定義遊戲變數
const puzzleInformation = {
    // puzzle 的數量
    amount: 9,
    // 每一個 puzzle 的大小
    scale: {
        width: 300,
        height: 300,
    },
    // 用於儲存在遊戲中的 puzzle
    crop: null,
    // 用於儲存每片 puzzle 的大小
    cropScale: 0.8,
    // 用於儲存 九個 puzzle 的位置
    standardPosition: [
        { x: 150, y: 150 }, { x: 400, y: 150 }, { x: 650, y: 150 },
        { x: 150, y: 400 }, { x: 400, y: 400 }, { x: 650, y: 400 },
        { x: 150, y: 650 }, { x: 400, y: 650 }, { x: 650, y: 650 }
    ],
    // 用於儲存 九個 puzzle 的動態位置
    motionPosition: [],
    // 用於儲存要抹去的 puzzle 編號
    invisiblePuzzle: null,
    // 用於儲存是否獲勝
    isFinish: false,
}

function preload() {
    // 使用 spritesheet 載入
    this.load.spritesheet('puzzle', '../media/img/pokemon.jpeg', {
        // 利用設定好的變數設定每個 frame 切割寬高
        frameHeight: puzzleInformation.scale.height,
        frameWidth: puzzleInformation.scale.width,
    })
}

function create() {
    //隨機選擇一塊 puzzle 並記住他，在生成時不會生成他
    puzzleInformation.invisiblePuzzle = Math.floor(Math.random() * 9)
    //將 crop 設為 Phaser 的群組
    puzzleInformation.crop = this.add.group()

    for (let i = 0; i < puzzleInformation.amount; i++) {
        // 隨機從 0 ~ 8 選擇一塊生成
        let randomPick = Math.floor(Math.random() * 9)

        // 若選到已經生成過的，則跳過他
        if (puzzleInformation.motionPosition.includes(randomPick)) {
            i--
        }

        // 若選到的是要去掉的那塊，則跳過他
        else if (randomPick == puzzleInformation.invisiblePuzzle) {
            // 創建隱藏的 puzzle ，並將其設置看不到
            puzzleInformation.crop.create(
                puzzleInformation.standardPosition[i].x,
                puzzleInformation.standardPosition[i].y,
                'puzzle',
                randomPick
            ).setVisible(false).setScale(puzzleInformation.cropScale)
            // 在renderedPuzzle 中加入該 puzzle
            puzzleInformation.motionPosition.push(randomPick)
        }

        // 若無上述問題 則生成該 puzzle
        else {
            let puzzle = puzzleInformation.crop.create(
                puzzleInformation.standardPosition[i].x,
                puzzleInformation.standardPosition[i].y,
                'puzzle',
                randomPick
            ).setScale(puzzleInformation.cropScale)
            // 在renderedPuzzle 中加入該 puzzle
            puzzleInformation.motionPosition.push(randomPick)
        }
    }
}

function update() {

}